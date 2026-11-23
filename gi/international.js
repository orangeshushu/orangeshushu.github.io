/* Private, user-initiated reader for the Della Corte lab's research workbook.
 * All original workbook rows stay in the user's browser. Pinning the source
 * lets the narrow OOXML reader and the two verified corrections fail closed.
 */
(() => {
  "use strict";
  const projectUrl = "https://github.com/dellacortelab/nhanes_gigl";
  const revision = "c5b1ca570531f12c489083d9c8c498d548486a48";
  const sourceUrl = "https://raw.githubusercontent.com/dellacortelab/nhanes_gigl/" + revision + "/data/gi_db_sydney.xlsx";
  const sha256 = "e4f8e21d6d9ad187d9cc45b8d314fd9afe85d4b08c045347caaf5401010719b9";
  const workbookBytes = 218821;

  // First numbered item per source category, separately for both tables.
  const categories = [
    ["烘焙食品", "Bakery products", 1, 2092],
    ["饮料", "Beverages", 72, 2133],
    ["面包", "Breads", 145, 2154],
    ["早餐谷物", "Breakfast cereals", 359, 2444],
    ["谷物", "Cereal grains", 526, 2544],
    ["饼干", "Cookies", 715, 2771],
    ["薄脆饼干", "Crackers", 850, 2810],
    ["乳制品及替代品", "Dairy products and alternatives", 891, 2828],
    ["水果及制品", "Fruit and fruit products", 1078, 2887],
    ["果蔬汁", "Fruit and vegetable juices", 1180, 3043],
    ["婴儿配方及辅食", "Infant formula and weaning foods", 1235, 3058],
    ["豆类", "Legumes", 1278, 3072],
    ["代餐及体重管理食品", "Meal replacements and weight management", 1310, 3182],
    ["营养支持食品", "Nutritional support products", 1369, 3210],
    ["坚果", "Nuts", 1431, 3236],
    ["意面及面条", "Pasta and noodles", 1434, 3248],
    ["零食及糖果", "Snacks and confectionery", 1511, 3364],
    ["汤", "Soups", 1719, 3421],
    ["糖及糖浆", "Sugars and syrups", 1740, 3428],
    ["蔬菜", "Vegetables", 1790, 3566],
    ["地方及传统食品", "Regional and traditional foods", 1947, 3683]
  ];
  const correctedNames = {
    2118: "Sweet roll with Bengal gram flour, wheat flour, ghee and honey",
    3490: "Monofloral milk-vetch honey (Astragalus spp.), Kayseri, Turkey"
  };
  const duplicatedPrintIds = {2211: "T2 p.11 #2111", 3536: "T2 p.102 #2536"};
  const issue = (code, message) => Object.assign(new Error(message), {code});

  function makeRow(item, en, gi) {
    const table = item <= 2091 ? 1 : 2;
    const start = table + 1;
    const [categoryZh, categoryEn] = categories.filter(category => item >= category[start]).at(-1);
    return {en, gi, categoryZh, categoryEn, sourceId:"international-local", item, table, ref:duplicatedPrintIds[item] || "T" + table + " #" + item};
  }

  async function readSheetParts(buffer) {
    // These offsets are defined by the ZIP local-file and directory headers.
    // Input is a hash-verified XLSX with no ZIP64 records or archive comment.
    const zip = new DataView(buffer);
    const end = buffer.byteLength - 22;
    if (zip.getUint32(end, true) !== 0x06054b50) throw issue("format", "Invalid ZIP directory");
    const count = zip.getUint16(end + 10, true);
    let position = zip.getUint32(end + 16, true);
    const parts = {};
    for (let index = 0; index < count; index++) {
      if (zip.getUint32(position, true) !== 0x02014b50) throw issue("format", "Invalid ZIP entry");
      const length = zip.getUint32(position + 20, true);
      const filenameLength = zip.getUint16(position + 28, true);
      const extraLength = zip.getUint16(position + 30, true);
      const commentLength = zip.getUint16(position + 32, true);
      const filename = new TextDecoder().decode(new Uint8Array(buffer, position + 46, filenameLength));
      if (filename === "xl/sharedStrings.xml" || filename === "xl/worksheets/sheet1.xml") {
        const local = zip.getUint32(position + 42, true);
        const content = local + 30 + zip.getUint16(local + 26, true) + zip.getUint16(local + 28, true);
        const payload = new Blob([new Uint8Array(buffer, content, length)]);
        let stream;
        try { stream = new DecompressionStream("deflate-raw"); }
        catch { throw issue("unsupported", "This browser cannot decompress XLSX"); }
        parts[filename] = await new Response(payload.stream().pipeThrough(stream)).text();
      }
      position += 46 + filenameLength + extraLength + commentLength;
    }
    return parts;
  }

  function unescapeText(xml) {
    const named = {amp:"&", quot:'"', apos:"'", lt:"<", gt:">"};
    return xml.replace(/&(amp|quot|apos|lt|gt|#x[\da-fA-F]+|#\d+);/g, (_, entity) => {
      if (entity in named) return named[entity];
      return String.fromCodePoint(entity.startsWith("#x") ? parseInt(entity.slice(2), 16) : Number(entity.slice(1)));
    });
  }

  async function readWorkbook(file) {
    if (file.size !== workbookBytes) throw issue("source", "Select the reference workbook from the linked revision");
    if (!globalThis.crypto?.subtle) throw issue("unsupported", "HTTPS and Web Crypto are required");
    const buffer = await file.arrayBuffer();
    const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", buffer));
    if (Array.from(digest, byte => byte.toString(16).padStart(2, "0")).join("") !== sha256)
      throw issue("source", "Workbook differs from the checked research release");
    const parts = await readSheetParts(buffer);
    // Only the pinned worksheet layout is supported: text in shared strings,
    // numeric cell values and optional blank cells. No formula evaluation.
    const strings = Array.from(parts["xl/sharedStrings.xml"].matchAll(/<si>([\s\S]*?)<\/si>/g), match =>
      Array.from(match[1].matchAll(/<t(?: [^>]*)?>([\s\S]*?)<\/t>/g), text => unescapeText(text[1])).join(""));
    const records = [];
    for (const row of parts["xl/worksheets/sheet1.xml"].matchAll(/<row [^>]*>([\s\S]*?)<\/row>/g)) {
      const cells = {};
      for (const cell of row[1].matchAll(/<c r="([A-G])(\d+)"([^>]*)><v>([^<]*)<\/v><\/c>/g)) {
        cells[cell[1]] = cell[3].includes('t="s"') ? strings[Number(cell[4])] : cell[4];
      }
      if (cells.C === "GI Description") continue;
      const item = Number(cells.B);
      if (item === 4012) continue; // In the original supplement this number marks a subheading.
      const values = JSON.parse(cells.F);
      let gi = values[0];
      // Independent check of the GI column: 11 was GL; 375 was a reference number.
      if (item === 2118) gi = 38;
      if (item === 3490) gi = 69;
      if (!Number.isInteger(item) || !cells.C || !Number.isFinite(gi)) throw issue("format", "Unexpected workbook row");
      records.push(makeRow(item, correctedNames[item] || cells.C, gi));
    }
    // One measured item omitted by the secondary extraction. Descriptive label
    // assembled from factual food, brand and preparation details in ST1 row 3.
    records.push(makeRow(3, "Betty Crocker chocolate cake with chocolate frosting, prepared from mix", 38));
    records.sort((a,b) => a.item - b.item);
    if (records.length !== 4017 || new Set(records.map(row => row.item)).size !== 4017)
      throw issue("format", "Unexpected record count");
    return records;
  }

  window.atlasImportGI = readWorkbook;
  window.atlasReadGIFromSource = async () => {
    let file;
    try {
      const response = await fetch(sourceUrl, {credentials:"omit", referrerPolicy:"no-referrer"});
      if (!response.ok) throw new Error("Source unavailable");
      file = await response.blob();
    } catch { throw issue("network", "Could not download the workbook from the study repository"); }
    return readWorkbook(file);
  };
  window.atlasImportInfo = Object.freeze({
    sourceUrl, projectUrl, sha256, workbookBytes, workbookRows:4017, rawUniqueNames:3595, usableRows:4017, usableUniqueNames:3596,
    articleUrl:"https://doi.org/10.1093/ajcn/nqab233",
    secondaryStudyUrl:"https://doi.org/10.1016/j.ajcnut.2024.06.001",
    termsUrl:"https://www.elsevier.com/about/policies-and-standards/open-access-licenses/elsevier-user",
    workbookUrl:projectUrl + "/blob/" + revision + "/data/gi_db_sydney.xlsx",
    corrections:[{item:2118, gi:38, sourceCell:11}, {item:3490, gi:69, sourceCell:375}],
    omittedSubheading:4012, restoredItem:3
  });
})();
