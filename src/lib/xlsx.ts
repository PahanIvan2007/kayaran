export function generateXLSX(data: { sheets: { name: string; headers: string[]; rows: string[][] }[] }): Blob {
  const encoder = new TextEncoder()

  function buildSheetXML(_name: string, headers: string[], rows: string[][]): string {
    const cols = headers.map((_, i) => `<col min="${i + 1}" max="${i + 1}" width="20"/>`).join('')
    const headerRow = `<row r="1">${headers.map((h, i) => `<cell r="${String.fromCharCode(65 + i)}1" t="inlineStr"><is><t>${escapeXml(h)}</t></is></cell>`).join('')}</row>`
    const dataRows = rows.map((row, ri) => {
      const rn = ri + 2
      return `<row r="${rn}">${row.map((cell, ci) => {
        const ref = `${String.fromCharCode(65 + ci)}${rn}`
        const num = parseFloat(cell)
        if (!isNaN(num) && String(num) === cell.trim()) {
          return `<cell r="${ref}" t="n"><v>${num}</v></cell>`
        }
        return `<cell r="${ref}" t="inlineStr"><is><t>${escapeXml(cell)}</t></is></cell>`
      }).join('')}</row>`
    }).join('')

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
        <sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
        <cols>${cols}</cols>
        <sheetData>${headerRow}${dataRows}</sheetData>
      </worksheet>`
  }

  function escapeXml(s: string): string {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  }

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
      <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
      <Default Extension="xml" ContentType="application/xml"/>
      <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
      ${data.sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}
    </Types>`

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
    </Relationships>`

  const wbRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      ${data.sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}
    </Relationships>`

  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
      <sheets>${data.sheets.map((s, i) => `<sheet name="${escapeXml(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets>
    </workbook>`

  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
      <fonts count="2">
        <font><sz val="11"/><color rgb="FFe2e8f0"/></font>
        <font><sz val="11"/><b/><color rgb="FFa78bfa"/></font>
      </fonts>
      <fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>
      <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
      <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
      <cellXfs count="2">
        <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
        <xf numFmtId="0" fontId="1" fillId="0" borderId="0"/>
      </cellXfs>
    </styleSheet>`

  function buildSheetFile(sheets: { name: string; headers: string[]; rows: string[][] }[]) {
    const parts: BlobPart[] = []

    const zipHeaders = (path: string, content: string) => {
      const data = encoder.encode(content)
      const crc = crc32(data)
      parts.push(makeZipEntry(path, data, crc))
    }

    zipHeaders('[Content_Types].xml', contentTypes)
    zipHeaders('_rels/.rels', rels)
    zipHeaders('xl/_rels/workbook.xml.rels', wbRels)
    zipHeaders('xl/workbook.xml', workbook)
    zipHeaders('xl/styles.xml', styles)
    sheets.forEach((s, i) => zipHeaders(`xl/worksheets/sheet${i + 1}.xml`, buildSheetXML(s.name, s.headers, s.rows)))

    return new Blob(parts, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  }

  function makeZipEntry(name: string, data: Uint8Array, crc: number): BlobPart {
    const nameEnc = encoder.encode(name)
    const header = new ArrayBuffer(30 + nameEnc.length)
    const v = new DataView(header)

    v.setUint32(0, 0x04034b50, true)
    v.setUint16(4, 20, true)
    v.setUint16(6, 0, true)
    v.setUint16(8, 0, true)
    v.setUint16(10, 8, true)
    v.setUint32(14, crc, true)
    v.setUint32(18, data.length, true)
    v.setUint32(22, data.length, true)
    v.setUint16(26, nameEnc.length, true)

    const headerArr = new Uint8Array(header)
    headerArr.set(nameEnc, 30)

    const deflated = new Uint8Array(data.length + 2)
    deflated[0] = 0x78; deflated[1] = 0x01
    deflated.set(data, 2)

    return new Blob([headerArr, deflated.slice(2)])
  }

  function crc32(data: Uint8Array): number {
    let crc = 0xFFFFFFFF
    for (let i = 0; i < data.length; i++) {
      crc ^= data[i]
      for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0)
    }
    return ~crc >>> 0
  }

  return buildSheetFile(data.sheets)
}

export function downloadXLSX(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
