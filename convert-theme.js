const fs = require('fs');
const path = require('path');

const replacements = [
  [/text-neutral-100/g, 'text-[#0B130F]'],
  [/text-neutral-200/g, 'text-[#0B130F]'],
  [/text-neutral-300/g, 'text-[#6C7E75]'],
  [/text-neutral-400/g, 'text-[#6C7E75]'],
  [/text-neutral-500/g, 'text-[#879A91]'],
  [/bg-neutral-900\/50/g, 'bg-white'],
  [/bg-neutral-900/g, 'bg-[#F4F6F5]'],
  [/bg-neutral-950/g, 'bg-white'],
  [/bg-neutral-800\/50/g, 'bg-[#E9EFEF]'],
  [/bg-neutral-800\/30/g, 'bg-[#F4F6F5]'],
  [/bg-neutral-800/g, 'bg-[#E9EFEF]'],
  [/border-neutral-800\/50/g, 'border-[#E9EFEF]'],
  [/border-neutral-800/g, 'border-[#E9EFEF]'],
  [/divide-neutral-800\/50/g, 'divide-[#E9EFEF]'],
  [/divide-neutral-800/g, 'divide-[#E9EFEF]'],
  [/ring-neutral-700/g, 'ring-[#E9EFEF]'],
  [/bg-amber-500\/10/g, 'bg-[#B4F105]\/10'],
  [/text-amber-500/g, 'text-[#072F1F]'],
  [/ring-amber-500/g, 'ring-[#B4F105]'],
  [/border-amber-500/g, 'border-[#B4F105]'],
  [/bg-amber-500/g, 'bg-[#B4F105]'],
  [/text-neutral-950/g, 'text-[#051C12]'],
];

const files = [
  'src/app/admin/stok/page.tsx',
  'src/app/admin/pemesan/page.tsx',
  'src/app/admin/riwayat/page.tsx'
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  let content = fs.readFileSync(filePath, 'utf8');
  replacements.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
  });
  fs.writeFileSync(filePath, content);
  console.log('Updated ' + file);
});
