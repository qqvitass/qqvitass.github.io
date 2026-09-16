from pathlib import Path
from PIL import Image
import shutil, json

root = Path(__file__).resolve().parents[2] / '海尔'
out = Path(__file__).resolve().parents[1] / 'public' / 'works'
out.mkdir(parents=True, exist_ok=True)
items = [
 ('detail', '详情页/be31af89bqd32a952e039157e388b6e6.jpg'),
 ('daily', '分会场首页/京东日常净水首页设计-301.png'),
 ('campaign', '分会场首页/APP端.png'),
 ('campaign-kv', '分会场首页/24111.png'),
 ('promo-1', '前置促销图/详情页关联-515.jpg'),
 ('promo-2', '前置促销图/鲜活水产品对比拉踩-1218.jpg'),
 ('poster-1', '推广图/HKC3000-R857U1推广图.jpg'),
 ('poster-2', '推广图/HKC3000-R988HU1推广图.jpg'),
 ('poster-3', '推广图/HKC3500-R502U1推广图.jpg'),
 ('poster-4', '推广图/HCF75-2LXWZU1推广图.png'),
 ('live-1', '直播间/618直播间贴片-519.jpg'),
 ('live-2', '直播间/直播间开学季风格设计-903.jpg'),
 ('live-3', '直播间/直播间年货节设计-0125.jpg'),
 ('main-1', '主图副图/800-HKC3000-R88D2I1.jpg'),
 ('main-2', '主图副图/800-HCF75-2LXWZU1 .jpg'),
 ('main-3', '主图副图/800-HQZ50-XFAZ12.jpg'),
 ('main-4', '主图副图/800-HP-37PRO+H800-KC3000-R988HU1+HGDZ2571-U1.png'),
]
manifest = {}
for key, relative in items:
    source = root / relative
    original = key + '-original' + source.suffix
    shutil.copy2(source, out / original)
    with Image.open(source) as im:
        im = im.convert('RGB')
        width, height = im.size
        cover = im.crop((0, 0, width, min(height, round(width * 1.38)))) if key in ('detail', 'daily', 'campaign') else im.copy()
        cover.thumbnail((900, 1600))
        cover.save(out / (key + '.webp'), quality=91)
        segments = []
        if key in ('detail', 'daily', 'campaign'):
            for i, top in enumerate(range(0, height, width * 3)):
                name = f'{key}-{i+1:02}.webp'
                im.crop((0, top, width, min(top + width * 3, height))).save(out / name, quality=92)
                segments.append('/works/' + name)
        manifest[key] = dict(src='/works/' + key + '.webp', original='/works/' + original, width=width, height=height, segments=segments, source=str(source))
(out / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'已准备 {len(items)} 份作品；原文件未修改。')
