import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(root, "data", "portfolio-data.js");
const outPath = path.join(root, "assets", "cv", "Taonga-CV.pdf");

const source = fs.readFileSync(dataPath, "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source, sandbox);

const data = sandbox.window.portfolioData;
const lines = [];

const add = (line = "") => lines.push(line);
const bullets = (items) => items.forEach((item) => add(`- ${item}`));

add(data.personal.name);
add(data.personal.headline);
add(data.contact.location);
add("");
add("Professional Summary");
add(data.personal.summary);
add("");
add("Computer Science Focus");
add(data.computerScience.summary);
bullets(data.computerScience.strengths);
add("");
add("Technical Skills");
data.computerScience.skillGroups.forEach((group) => {
  add(`${group.name}: ${group.items.join(", ")}`);
});
add("");
add("Featured Projects");
data.projects.forEach((project) => {
  add(project.name);
  add(`${project.type}. ${project.description}`);
  add(`Role: ${project.role}`);
  if (project.achievement) add(`Achievement: ${project.achievement}`);
  add(`Technologies: ${project.technologies.join(", ")}`);
  add("");
});
add("Experience");
data.experience.forEach((role) => {
  add(`${role.title} | ${role.organization} | ${role.period}`);
  bullets(role.highlights);
  add("");
});
add("Education");
data.education.forEach((education) => {
  add(`${education.qualification} | ${education.institution} | ${education.period}`);
  bullets(education.details);
});
add("");
add("Certifications and Recognition");
bullets(data.certifications);
add("");
add("Languages");
data.languages.forEach((language) => add(`${language.name}: ${language.level}`));

const escapePdf = (value) =>
  value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const wrap = (value, max = 94) => {
  const words = String(value).replace(/\s+/g, " ").trim().split(" ");
  const output = [];
  let line = "";
  words.forEach((word) => {
    if (!line) {
      line = word;
      return;
    }
    if ((line + " " + word).length <= max) {
      line += " " + word;
    } else {
      output.push(line);
      line = word;
    }
  });
  if (line) output.push(line);
  return output.length ? output : [""];
};

const pages = [];
let current = [];
const maxLines = 48;

lines.forEach((line) => {
  const wrapped = line ? wrap(line) : [""];
  wrapped.forEach((part) => {
    if (current.length >= maxLines) {
      pages.push(current);
      current = [];
    }
    current.push(part);
  });
});
if (current.length) pages.push(current);

const objects = [];
const addObject = (content) => {
  objects.push(content);
  return objects.length;
};

const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
const pagesId = addObject("");
const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
const pageIds = [];

pages.forEach((pageLines) => {
  const commands = ["BT", "/F1 10 Tf", "14 TL", "50 780 Td"];
  pageLines.forEach((line, index) => {
    if (index > 0) commands.push("T*");
    commands.push(`(${escapePdf(line)}) Tj`);
  });
  commands.push("ET");
  const stream = commands.join("\n");
  const streamId = addObject(`<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}\nendstream`);
  const pageId = addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${streamId} 0 R >>`);
  pageIds.push(pageId);
});

objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

let pdf = "%PDF-1.4\n";
const offsets = [0];
objects.forEach((content, index) => {
  offsets.push(Buffer.byteLength(pdf, "utf8"));
  pdf += `${index + 1} 0 obj\n${content}\nendobj\n`;
});
const xrefOffset = Buffer.byteLength(pdf, "utf8");
pdf += `xref\n0 ${objects.length + 1}\n`;
pdf += "0000000000 65535 f \n";
for (let i = 1; i < offsets.length; i += 1) {
  pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, pdf, "utf8");
console.log(`Wrote ${outPath}`);
