// Local-only drafts and a copyable order for sharing with family.
const escapeText = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today = () => {const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const saveDraft = () => {try{localStorage.setItem('family-menu-draft',JSON.stringify(order));}catch{}};
update = function(){const n=order.reduce((s,x)=>s+x.qty,0);$('#count').textContent=n?`已选 ${n} 道菜`:'还没有选菜';$('#orderList').innerHTML=order.length?order.map((x,i)=>`<div class="line"><span>${escapeText(x.name)}</span><div class="qty"><button aria-label="减少 ${escapeText(x.name)}" data-i="${i}" data-d="-">−</button><b>${x.qty}</b><button aria-label="增加 ${escapeText(x.name)}" data-i="${i}" data-d="+">＋</button></div></div>`).join(''):'<div class="empty">从食材开始挑一道吧</div>';saveDraft();};
try{const draft=JSON.parse(localStorage.getItem('family-menu-draft')||'[]');if(Array.isArray(draft))order=draft.filter(x=>typeof x.name==='string'&&Number.isInteger(x.qty)&&x.qty>0);}catch{}
$('#date').value=today();$('#date').min=today();
document.querySelector('label').htmlFor='date';document.querySelectorAll('label')[2].htmlFor='note';
const style=document.createElement('style');style.textContent='[hidden]{display:none!important}button,input,textarea{font-size:16px}button{min-height:44px}.bar{padding-bottom:calc(11px + env(safe-area-inset-bottom))}.panel{margin:0 auto}.receipt{white-space:pre-wrap;line-height:1.8;font:inherit;background:#f3f5ef;padding:16px;border-radius:12px;overflow-wrap:anywhere}.close-sheet{float:right;border:0;background:#e7f1ed;border-radius:9px;padding:8px 12px;color:#153f42}';document.head.append(style);
const receipt=document.createElement('div');receipt.className='sheet';receipt.id='receiptSheet';receipt.innerHTML='<section class="panel" role="dialog" aria-label="已生成的预订单"><button class="close-sheet" id="closeReceipt">关闭</button><h2>预订单已生成</h2><pre class="receipt" id="receiptText"></pre><button class="submit" id="copyReceipt">复制清单，发给家人</button><p style="font-size:13px;color:#657370">清单保存在此设备；复制后可粘贴到微信发送。</p></section>';document.body.append(receipt);
$('#closeReceipt').onclick=()=>receipt.classList.remove('show');receipt.onclick=e=>{if(e.target===receipt)receipt.classList.remove('show');};
const showReceipt=text=>{$('#receiptText').textContent=text;receipt.classList.add('show');};
$('#submit').onclick=()=>{if(!order.length)return toast('请先选择菜品');const date=$('#date').value;if(!date||date<today())return toast('请选择今天或之后的日期');const text=`家庭预点菜单\n${date} · ${meal}\n\n${order.map((x,i)=>`${i+1}. ${x.name}${x.qty>1?' × '+x.qty:''}`).join('\n')}\n\n备注：${$('#note').value.trim()||'无'}`;try{localStorage.setItem('family-menu-last-order',text);}catch{}$('#orderSheet').classList.remove('show');showReceipt(text);};
$('#copyReceipt').onclick=async()=>{const text=$('#receiptText').textContent;try{await navigator.clipboard.writeText(text);toast('已复制，可粘贴到微信');}catch{const range=document.createRange();range.selectNodeContents($('#receiptText'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);toast('请长按选中的文字复制');}};
const lastButton=document.createElement('button');lastButton.className='submit';lastButton.style.background='#237871';lastButton.textContent='查看上次预订单';lastButton.onclick=()=>{let text;try{text=localStorage.getItem('family-menu-last-order');}catch{}text?showReceipt(text):toast('还没有生成过预订单');};document.querySelector('.custom').append(lastButton);
const closeOrder=document.createElement('button');closeOrder.className='close-sheet';closeOrder.textContent='继续点菜';closeOrder.onclick=()=>$('#orderSheet').classList.remove('show');document.querySelector('#orderSheet .panel').prepend(closeOrder);
// Keep every explicitly supplied dish available without guessing an unspecified fish.
catalog['鱼'].push(['鱿鱼仔',['砂锅焗鱿鱼仔']]);
catalog['鱼'].find(x=>x[0]==='鸦片鱼头')[1]=['葱油鸦片鱼头','砂锅焗鸦片鱼头'];
catalog['鱼'].find(x=>x[0]==='黑鱼')[1]=['蒜香黑鱼片','葱油黑鱼片'];
catalog['鱼'].push(['其他鱼菜',['酸菜鱼','鱼头豆腐汤']]);
catalog['鱼'].push(['鳗鱼',['清蒸鳗鱼','红烧鳗鱼']]);
catalog['禽类'] = [
  ['鸡', ['葱姜炒鸡','黄焖鸡','香菇炖鸡','板栗烧鸡','土豆鸡块','葱油鸡','三杯鸡','干蒸鸡','苹果炖鸡','胡椒鸡煲','白斩鸡','烤鸡']],
  ['鸡腿', ['红烧鸡腿','照烧鸡腿','奥尔良鸡腿']],
  ['鸡翅', ['红烧鸡翅','可乐鸡翅','咸蛋黄鸡翅','蒜香鸡翅','椒盐鸡翅','柠檬香煎鸡翅','奥尔良鸡翅']],
  ['鸡爪', ['红烧鸡爪','蒜香鸡爪','虎皮鸡爪']],
  ['鸡杂', ['爆炒鸡杂']],
  ['鸡翅鸡爪鲜虾', ['鸡翅鸡爪鲜虾煲']],
  ['鹌鹑', ['椒盐鹌鹑','红烧鹌鹑']],
  ['鸭', ['姜母鸭','姜焖鸭','啤酒鸭','白斩鸭','麻油鸭','烤鸭','酱板鸭']],
  ['鹅', ['白斩鹅','烤鹅']]
];
catalog['猪肉类'] = [
  ['排骨', ['糖醋小排','糖醋仔排','椒盐排骨','黄焖排骨','蒜香排骨','清蒸排骨']],
  ['猪排', ['红烧猪排','蒜香猪排','苹果炖猪排','酥炸猪排']],
  ['大排', ['葱烧大排']],
  ['五花肉', ['红烧肉','香煎五花肉','酥炸五花肉','白切五花肉','回锅肉']],
  ['猪肉', ['菠萝咕噜肉','小炒肉','农家一碗香','糖醋里脊','溜肉段','水煮肉片','油豆腐烧肉','小酥肉','蜜汁卤肉','肉饼蒸蛋']],
  ['猪蹄', ['红烧猪蹄','黄豆炖猪蹄','椒盐猪蹄','烤猪蹄','蹄花汤']],
  ['猪舌', ['葱爆猪舌','白灼猪舌','砂锅焗猪舌']],
  ['猪腰', ['爆炒腰花']]
];
catalog['牛肉类'] = [
  ['牛杂', ['五香牛杂']],
  ['牛肉粒', ['蒜香牛肉粒','土豆牛肉粒','黑椒牛肉粒']],
  ['牛肉', ['干蒸牛肉','凉拌牛肉','水煮牛肉','爆炒牛肉','洋葱炒牛肉','芦笋炒牛肉','杏鲍菇炒牛肉','芹菜炒牛肉','雪菜烧牛肉','口蘑炒牛肉']],
  ['牛腩', ['番茄炖牛腩','土豆炖牛腩','红烧牛腩','萝卜炖牛腩']],
  ['肥牛', ['葱香肥牛']],
  ['牛肋条', ['苹果炖牛肋条','清炖牛肋条','蒜香牛肋条','红烧牛肋条']]
];
catalog['蛋'] = [
  ['鹌鹑蛋', ['红烧鹌鹑蛋']],
  ['鸡蛋', ['小葱跑蛋','萝卜包菜丝炒鸡蛋','番茄炒鸡蛋','西葫芦炒鸡蛋','菠菜炒鸡蛋','水蒸蛋','小葱醋炒蛋','葱花煎蛋','韭菜炒鸡蛋','韭黄炒鸡蛋','大葱炒鸡蛋']],
  ['荷包蛋', ['糖醋荷包蛋','荷包蛋炒肉','酱汁荷包蛋','素鸡焖荷包蛋']]
];
catalog['豆制品'] = [
  ['豆腐', ['皮蛋豆腐','铁板豆腐','家常豆腐','香煎豆腐','肉沫豆腐','菌菇豆腐煲','抱蛋豆腐','葱烧豆腐']],
  ['香干', ['芹菜炒香干','豆芽炒香干']],
  ['面结', ['葱油面结','红烧面结']],
  ['素鸡', ['家常炒素鸡','红烧素鸡']]
];
catalog['蔬菜类'] = [
  ['叶菜', ['手撕包菜','口蘑炒青菜','香菇炒青菜','清炒空心菜','清炒木耳菜','清炒菠菜','清炒菜心','白灼生菜','蚝油生菜','蒜蓉油麦菜','清炒小白菜','清炒娃娃菜','清炒鸡毛菜']],
  ['根茎与花菜', ['醋溜土豆丝','花菜炒肉','莲藕木耳炒胡萝卜','清炒西兰花','清炒莴笋丝','肉沫土豆','椒盐土豆','肉末土豆片','莴笋炒肉片','彩椒炒山药','炒胡萝卜丝','葱油芋艿']],
  ['豆类', ['清炒绿豆芽','干煸四季豆','话梅毛豆','清炒荷兰豆','豆角炒肉','豇豆炒肉','荷兰豆炒藕片']],
  ['茄瓜类', ['咸蛋黄南瓜','鱼香茄子','肉末茄子','土豆烧茄子','红烧冬瓜','西红柿炒西葫芦','家常烧茄子','凉拌黄瓜','丝瓜炒毛豆','白灼秋葵']],
  ['菌菇', ['木耳炒肉片','香菇炒肉片','炸蘑菇','素炒双菇']],
  ['茎菜', ['香菇炒芦笋','蒜苔炒肉','油焖茭白','茭白炒毛豆','芹菜炒肉丝']],
  ['玉米', ['玉米青豆胡萝粒','清炒玉米粒']]
];
catalog['汤类'] = [
  ['蛋花汤', ['紫菜蛋花汤','番茄蛋花汤','丝瓜蛋花汤']],
  ['骨头汤', ['芋艿骨头汤','萝卜骨头汤','山药骨头汤','冬瓜骨头汤','莲藕骨头汤']],
  ['排骨汤', ['芋艿排骨汤','萝卜排骨汤','山药排骨汤','冬瓜排骨汤','莲藕排骨汤']],
  ['菌菇汤', ['菌菇汤','三鲜菌菇汤','番茄菌菇汤']],
  ['家常汤', ['青菜面结汤','白菜豆腐汤','肠血面结汤','鲜蔬芙蓉汤','口蘑青菜汤']],
  ['肉圆汤', ['小青菜肉圆汤','冬瓜肉圆汤']],
  ['肉鱼汤', ['潮汕牛肉汤','黄豆猪蹄汤','鲫鱼豆腐汤']]
];
catalog['主食'] = [
  ['米饭', ['蛋炒饭','咖喱饭','照烧鸡腿饭','卤肉饭','香菇鸡肉焖饭']],
  ['蒸食', ['蒸南瓜','蒸红薯','蒸土豆','蒸玉米']]
];
catalog['蛙类'] = [
  ['牛蛙', ['爆炒牛蛙','蒜香牛蛙','红烧牛蛙','椒盐牛蛙','牛蛙煲']],
  ['田鸡', ['爆炒田鸡','蒜香田鸡','红烧田鸡','椒盐田鸡','田鸡煲']]
];
// Only list a dish here when its own illustrative image is available.
const dishImages = {
  "葱油黄鱼": "scallion-yellow-croaker.jpg",
  "红烧黄鱼": "braised-yellow-croaker.jpg",
  "雪菜黄鱼": "pickled-mustard-yellow-croaker.jpg",
  "椒盐黄鱼": "salt-pepper-yellow-croaker.jpg",
  "香煎黄鱼": "pan-fried-yellow-croaker.jpg",
  "砂锅焗黄鱼": "claypot-yellow-croaker.jpg",
  "葱油鲳鱼": "scallion-pomfret.jpg",
  "红烧鲳鱼": "braised-pomfret.jpg",
  "雪菜鲳鱼": "pickled-mustard-pomfret.jpg",
  "鲳鱼烧年糕": "pomfret-rice-cake.jpg",
  "葱油虾潺": "scallion-lizardfish.jpg",
  "红烧虾潺": "braised-lizardfish.jpg",
  "椒盐虾潺": "salt-pepper-lizardfish.jpg",
  "虾潺焗豆腐": "lizardfish-tofu-claypot.jpg",
  "玉秃蒸面结": "yutu-steamed.jpg",
  "虾潺烧豆腐": "lizardfish-tofu-braise.jpg",
  "葱油玉秃": "scallion-yutu.jpg",
  "红烧玉秃": "braised-yutu.jpg",
  "香煎玉秃": "pan-fried-yutu.jpg",
  "葱油鸦片鱼头": "opium-fish-head-scallion.jpg",
  "砂锅焗鸦片鱼头": "claypot-fish-head.jpg",
  "红烧鲈鱼": "braised-sea-bass.jpg",
  "葱油鲈鱼": "scallion-sea-bass.jpg",
  "砂锅焗鲈鱼": "claypot-sea-bass.jpg",
  "雪菜鲈鱼": "pickled-mustard-sea-bass.jpg",
  "红烧鳜鱼": "braised-mandarin-fish.jpg",
  "砂锅焗石斑鱼": "claypot-grouper.jpg",
  "葱油石斑鱼": "scallion-grouper.jpg",
  "酱爆鱿鱼": "spicy-braised-squid.jpg",
  "葱油多宝鱼": "scallion-turbot.jpg",
  "红烧昂刺鱼": "braised-anglerfish.jpg",
  "葱油黑鱼片": "audit-3020374.jpg",
  "清蒸鳗鱼": "steamed-eel.jpg",
  "红烧鳗鱼": "audit-3056123.jpg",
  "蒜蓉粉丝对虾": "garlic-vermicelli-prawns.jpg",
  "清蒸对虾": "steamed-prawns.jpg",
  "蒜香黄油对虾": "garlic-butter-prawns.jpg",
  "清蒸罗氏虾": "steamed-giant-river-prawns.jpg",
  "椒盐对虾": "salt-pepper-prawns.jpg",
  "油焖对虾": "oil-braised-prawns.jpg",
  "咖喱对虾": "curry-prawns.jpg",
  "避风塘对虾": "bifengtang-prawns.jpg",
  "芥末虾球": "mustard-shrimp-balls.jpg",
  "砂锅焗对虾": "claypot-prawns.jpg",
  "清蒸皮皮虾": "steamed-pipi-shrimp.jpg",
  "椒盐皮皮虾": "salt-pepper-pipi.jpg",
  "虾仁滑蛋": "shrimp-scrambled-eggs.jpg",
  "虾仁蒸蛋": "audit-3330552.jpg",
  "西兰花炒虾仁": "shrimp-broccoli.jpg",
  "西芹炒虾仁": "shrimp-celery.jpg",
  "清蒸白蟹": "steamed-swimming-crab.jpg",
  "姜葱炒白蟹": "ginger-scallion-crab.jpg",
  "白蟹炒年糕": "crab-rice-cakes.jpg",
  "毛蟹炒年糕": "audit-3007279.jpg",
  "清蒸青蟹": "audit-3356188.jpg",
  "葱油白蟹": "scallion-oil-crab.jpg",
  "砂锅焗白蟹": "claypot-swimming-crab.jpg",
  "白蟹豆腐羹": "swimming-crab-tofu.jpg",
  "白蟹蒸蛋": "swimming-crab-steamed-egg.jpg",
  "葱油鱿鱼": "scallion-squid.jpg",
  "大蒜炒鱿鱼": "garlic-squid-stir-fry.jpg",
  "蒜香干煎鱿鱼": "pan-fried-garlic-squid.jpg",
  "荷兰豆炒鱿鱼": "snow-peas-squid.jpg",
  "芹菜炒鱿鱼": "celery-squid.jpg",
  "葱姜炒鱿鱼": "ginger-scallion-squid.jpg",
  "酸菜鱼": "sauerkraut-fish.jpg",
  "蒜香黑鱼片": "audit-3332376.jpg",
  "鱼头豆腐汤": "fish-head-tofu-soup.jpg",
  "蛋炒饭": "egg-fried-rice.jpg",
  "咖喱饭": "curry-rice.jpg",
  "照烧鸡腿饭": "teriyaki-chicken-rice.jpg",
  "卤肉饭": "audit-2415749.jpg",
  "香菇鸡肉焖饭": "mushroom-chicken-rice.jpg",
  "蒸南瓜": "steamed-pumpkin.jpg",
  "蒸红薯": "steamed-sweet-potato.jpg",
  "蒸土豆": "steamed-potato.jpg",
  "蒸玉米": "steamed-corn.jpg",
  "盐水白灼对虾": "poached-prawns.jpg",
  "雪菜昂刺鱼": "pickled-mustard-anglerfish.jpg",
  "砂锅焗鳜鱼": "claypot-mandarin-fish.jpg",
  "葱油鳜鱼": "scallion-mandarin-fish.jpg",
  "姜葱炒青蟹": "audit-1256437.jpg",
  "砂锅焗毛蟹": "audit-3343956.jpg",
  "毛蟹豆腐羹": "audit-1607264.jpg",
  "青蟹蒸蛋": "green-crab-steamed-egg.jpg",
  "芦笋炒虾仁": "asparagus-shrimp.jpg",
  "葱烤皮皮虾": "scallion-grilled-pipi.jpg",
  "清蒸毛蟹": "audit-3340714.jpg",
  "葱油毛蟹": "audit-scallion-hairy-crab.jpg",
  "青蟹炒年糕": "audit-3130663.jpg",
  "油焖白蟹": "audit-3280966.jpg",
  "姜葱炒毛蟹": "audit-3139423.jpg",
  "葱油昂刺鱼": "scallion-anglerfish.jpg",
  "香葱虾球": "scallion-shrimp-balls.jpg",
  "酱烧白蟹": "sauce-braised-swimming-crab.jpg",
  "油焖毛蟹": "audit-1465745.jpg",
  "酱烧青蟹": "audit-1259571.jpg",
  "蛤蜊蒸蛋": "audit-2299186.jpg",
  "蒜香黄油蛤蜊": "garlic-butter-clams.jpg",
  "白灼花螺": "poached-babylon-snail.jpg",
  "白灼贻贝": "poached-mussels.jpg",
  "酱爆蛤蜊": "sauce-clams.jpg",
  "白灼花甲": "poached-clams.jpg",
  "蛤蜊冬瓜汤": "clam-wintermelon-soup.jpg",
  "葱油蛤蜊": "scallion-oil-clams.jpg",
  "蛤蜊丝瓜汤": "clam-luffa-soup.jpg",
  "葱油花甲": "scallion-oil-clams-2.jpg",
  "清蒸贻贝": "steamed-mussels.jpg",
  "蒜香黄油贻贝": "garlic-butter-mussels.jpg",
  "白灼蛤蜊": "poached-clams-alt.jpg",
  "清蒸花甲": "steamed-clams-oyster-sauce.jpg",
  "花甲蒸蛋": "steamed-clams-egg-custard.jpg",
  "贻贝蒸蛋": "steamed-mussels-egg.jpg",
  "花甲丝瓜汤": "clams-luffa-soup.jpg",
  "贻贝丝瓜汤": "mussels-luffa-soup.jpg",
  "蒜蓉粉丝罗氏虾": "garlic-vermicelli-prawns.jpg",
  "椒盐罗氏虾": "salt-pepper-prawns.jpg",
  "油焖罗氏虾": "oil-braised-prawns.jpg",
  "咖喱罗氏虾": "curry-prawns.jpg",
  "蒜香黄油罗氏虾": "garlic-butter-prawns.jpg",
  "砂锅焗罗氏虾": "claypot-prawns.jpg",
  "盐水白灼罗氏虾": "poached-prawns.jpg",
  "避风塘罗氏虾": "bifengtang-prawns.jpg",
  "蒜蓉粉丝基围虾": "garlic-vermicelli-prawns.jpg",
  "清蒸基围虾": "steamed-prawns.jpg",
  "盐水白灼基围虾": "poached-prawns.jpg",
  "清蒸小白虾": "steamed-prawns.jpg",
  "盐水白灼小白虾": "poached-prawns.jpg",
  "盐水白灼皮皮虾": "poached-pipi-shrimp.jpg",
  "毛蟹蒸蛋": "audit-2362612.jpg",
  "酱烧毛蟹": "audit-2984215.jpg",
  "葱油青蟹": "audit-2490017.jpg",
  "砂锅焗青蟹": "audit-2343109.jpg",
  "青蟹豆腐羹": "audit-1562246.jpg",
  "油焖青蟹": "audit-1259571.jpg",
  "蛤蜊蛋花汤": "clam-egg-soup.jpg",
  "花甲蛋花汤": "clam-egg-soup.jpg",
  "贻贝蛋花汤": "audit-3242811.jpg",
  "花甲冬瓜汤": "clam-wintermelon-soup.jpg",
  "贻贝冬瓜汤": "audit-3242551.jpg",
  "清蒸蛤蜊": "poached-clams.jpg",
  "葱姜炒蛤蜊": "scallion-oil-clams.jpg",
  "葱姜炒花甲": "scallion-oil-clams-2.jpg",
  "蒜香黄油花甲": "garlic-butter-clams.jpg",
  "酱爆花甲": "sauce-clams.jpg",
  "葱油贻贝": "audit-3242291.jpg",
  "葱姜炒贻贝": "audit-3242219.jpg",
  "酱爆贻贝": "audit-3242346.jpg",
  "清蒸花螺": "poached-babylon-snail.jpg",
  "大虾炒鱿鱼": "audit-shrimp-squid.jpg",
  "砂锅焗皮皮虾": "claypot-pipi.jpg",
  "葱爆虾仁": "scallion-shrimp.jpg",
  "玉米粒炒虾仁": "corn-shrimp.jpg",
  "咸蛋黄虾仁": "audit-3245755.jpg",
  "椒盐虾仁": "salt-pepper-shrimp.jpg",
  "口蘑炒虾仁": "audit-3359503.jpg",
  "时蔬虾饼": "shrimp-patties.jpg",
  "砂锅盐焗蛤蜊": "salt-baked-clams.jpg",
  "砂锅盐焗花甲": "salt-baked-clams.jpg",
  "砂锅盐焗贻贝": "audit-3119106.jpg",
  "葱油花螺": "sauce-seasnails.jpg",
  "葱姜炒花螺": "sauce-seasnails.jpg",
  "蒜香黄油花螺": "garlic-butter-seasnails.jpg",
  "砂锅盐焗花螺": "audit-2451067.jpg",
  "酱爆花螺": "sauce-seasnails.jpg",
  "家烧海鲜拼盘": "audit-1726199.png",
  "砂锅海鲜拼盘": "audit-seafood-claypot.jpg",
  "清蒸海鲜拼盘": "audit-3358767.jpg",
  "葱烧海鲜拼盘": "audit-scallion-seafood.jpg",
  "红烧鸡腿": "chicken-leg-braised.jpg",
  "红烧鸡翅": "chicken-wings-braised.jpg",
  "可乐鸡翅": "audit-3358540.jpg",
  "黄焖鸡": "huangmen-chicken.jpg",
  "红烧肉": "braised-pork.jpg",
  "糖醋小排": "audit-2291754.jpg",
  "菠萝咕噜肉": "pineapple-pork.jpg",
  "回锅肉": "twice-cooked-pork.jpg",
  "黑椒牛肉粒": "pepper-beef.jpg",
  "番茄炖牛腩": "tomato-brisket.jpg",
  "水煮牛肉": "boiled-beef.jpg",
  "凉拌牛肉": "cold-beef.jpg",
  "番茄炒鸡蛋": "tomato-eggs.jpg",
  "手撕包菜": "hand-torn-cabbage.jpg",
  "醋溜土豆丝": "vinegar-potato.jpg",
  "皮蛋豆腐": "preserved-egg-tofu.jpg",
  "蒜香牛肉粒": "garlic-beef.jpg",
  "爆炒牛肉": "stir-fried-beef.jpg",
  "红烧牛腩": "braised-brisket.jpg",
  "土豆炖牛腩": "audit-3357970.jpg",
  "萝卜炖牛腩": "audit-3325656.jpg",
  "洋葱炒牛肉": "onion-beef.jpg",
  "葱香肥牛": "audit-3341295.jpg",
  "土豆牛肉粒": "audit-3354460.jpg",
  "芦笋炒牛肉": "audit-3325912.jpg",
  "杏鲍菇炒牛肉": "audit-2415278.jpg",
  "芹菜炒牛肉": "audit-3356464.jpg",
  "口蘑炒牛肉": "audit-3347660.jpg",
  "雪菜烧牛肉": "audit-3230440.jpg",
  "苹果炖牛肋条": "audit-3356513.jpg",
  "清炖牛肋条": "audit-3346766.jpg",
  "蒜香牛肋条": "audit-3329517.jpg",
  "红烧牛肋条": "audit-3358616.jpg",
  "糖醋仔排": "audit-2419713.jpg",
  "椒盐排骨": "pepper-ribs.jpg",
  "黄焖排骨": "huangmen-ribs.jpg",
  "蒜香排骨": "garlic-ribs.jpg",
  "清蒸排骨": "audit-3341257.jpg",
  "红烧猪蹄": "audit-1558677.png",
  "黄豆炖猪蹄": "audit-3337157.jpg",
  "椒盐猪蹄": "audit-3003247.jpg",
  "烤猪蹄": "audit-3292466.jpg",
  "蹄花汤": "audit-2438370.jpg",
  "爆炒腰花": "stir-fried-pig-kidney.jpg",
  "蒜香猪排": "garlic-pork-chop.jpg",
  "酥炸猪排": "fried-pork-chop.jpg",
  "香煎五花肉": "pan-fried-pork-belly.jpg",
  "酥炸五花肉": "deep-fried-pork-belly.jpg",
  "糖醋里脊": "sweet-sour-tenderloin.jpg",
  "小酥肉": "crispy-pork.jpg",
  "白切五花肉": "white-cut-pork-belly.jpg",
  "蜜汁卤肉": "audit-2389814.jpg",
  "溜肉段": "slippery-pork.jpg",
  "油豆腐烧肉": "tofu-pork.jpg",
  "肉饼蒸蛋": "meat-patty-egg.jpg",
  "五香牛杂": "audit-cooked-beef-offal.jpg",
  "小炒肉": "xiaochao-pork.jpg",
  "农家一碗香": "farmhouse-pork.jpg",
  "水煮肉片": "boiled-pork.jpg",
  "葱爆猪舌": "scallion-pig-tongue.jpg",
  "白灼猪舌": "boiled-pig-tongue.jpg",
  "砂锅焗猪舌": "claypot-pig-tongue.jpg",
  "葱烧大排": "scallion-pork-chop.jpg",
  "苹果炖猪排": "apple-pork-chop.jpg",
  "口蘑炒青菜": "button-mushroom-greens.jpg",
  "香菇炒青菜": "shiitake-greens.jpg",
  "清炒空心菜": "water-spinach.jpg",
  "清炒木耳菜": "malabar-spinach.jpg",
  "清炒菜心": "choy-sum.jpg",
  "白灼生菜": "blanched-lettuce.jpg",
  "蚝油生菜": "oyster-lettuce.jpg",
  "蒜蓉油麦菜": "garlic-lettuce.jpg",
  "清炒菠菜": "spinach.jpg",
  "清炒小白菜": "baby-bok-choy.jpg",
  "清炒娃娃菜": "napa-cabbage.jpg",
  "清炒鸡毛菜": "chicken-greens.jpg",
  "清炒西兰花": "broccoli.jpg",
  "清炒莴笋丝": "lettuce-stem.jpg",
  "椒盐土豆": "salt-pepper-potato.jpg",
  "肉沫土豆": "minced-potato.jpg",
  "木耳炒肉片": "wood-ear-pork.jpg",
  "香菇炒肉片": "shiitake-pork.jpg",
  "炸蘑菇": "fried-mushrooms.jpg",
  "素炒双菇": "mixed-mushrooms.jpg",
  "蒜苔炒肉": "garlic-sprouts-pork.jpg",
  "油焖茭白": "braised-water-bamboo.jpg",
  "清炒绿豆芽": "mung-bean-sprouts.jpg",
  "干煸四季豆": "green-beans.jpg",
  "话梅毛豆": "plum-edamame.jpg",
  "清炒荷兰豆": "snow-peas.jpg",
  "豆角炒肉": "bean-pork.jpg",
  "豇豆炒肉": "cowpea-pork.jpg",
  "荷兰豆炒藕片": "snowpeas-lotus.jpg",
  "彩椒炒山药": "audit-1194686.jpg",
  "花菜炒肉": "cauliflower-pork.jpg",
  "莲藕木耳炒胡萝卜": "lotus-root-carrot.jpg",
  "肉末土豆片": "audit-3207219.jpg",
  "莴笋炒肉片": "lettuce-stem-pork.jpg",
  "炒胡萝卜丝": "carrot-shreds.jpg",
  "葱油芋艿": "scallion-taro.jpg",
  "家常烧茄子": "braised-eggplant.jpg",
  "凉拌黄瓜": "cucumber.jpg",
  "三鲜菌菇汤": "mixed-mushroom-soup.jpg",
  "丝瓜蛋花汤": "luffa-egg-soup.jpg",
  "冬瓜排骨汤": "wintermelon-rib-soup.jpg",
  "冬瓜肉圆汤": "wintermelon-meatball-soup.jpg",
  "小青菜肉圆汤": "greens-meatball-soup.jpg",
  "山药排骨汤": "yam-rib-soup.jpg",
  "山药骨头汤": "yam-bone-soup.jpg",
  "番茄菌菇汤": "tomato-mushroom.jpg",
  "番茄蛋花汤": "tomato-egg.jpg",
  "白菜豆腐汤": "cabbage-tofu.jpg",
  "紫菜蛋花汤": "audit-3271852.jpg",
  "肠血面结汤": "noodle-tofu-soup.jpg",
  "芋艿排骨汤": "taro-rib-soup.jpg",
  "芋艿骨头汤": "taro-bone-soup.jpg",
  "莲藕排骨汤": "lotus-rib-soup.jpg",
  "萝卜排骨汤": "radish-rib-soup.jpg",
  "萝卜骨头汤": "radish-bone-soup.jpg",
  "莲藕骨头汤": "lotus-bone-soup.jpg",
  "潮汕牛肉汤": "chaozhou-beef-soup.jpg",
  "青菜面结汤": "greens-noodle-soup.jpg",
  "鲜蔬芙蓉汤": "vegetable-furong-soup.jpg",
  "鲫鱼豆腐汤": "crucian-tofu-soup.jpg",
  "黄豆猪蹄汤": "soy-pork-trotter-soup.jpg",
  "冬瓜骨头汤": "wintermelon-bone-soup.jpg",
  "菌菇汤": "audit-3325559.jpg",
  "口蘑青菜汤": "audit-bokchoy-mushroom-soup.jpg",
  "大葱炒鸡蛋": "scallion-eggs.jpg",
  "小葱跑蛋": "scallion-runny-eggs.jpg",
  "小葱醋炒蛋": "scallion-vinegar-eggs.jpg",
  "水蒸蛋": "steamed-egg-custard.jpg",
  "糖醋荷包蛋": "sweet-sour-egg.jpg",
  "素鸡焖荷包蛋": "soy-chicken-egg.jpg",
  "红烧鹌鹑蛋": "braised-quail-eggs.jpg",
  "荷包蛋炒肉": "egg-and-pork.jpg",
  "萝卜包菜丝炒鸡蛋": "cabbage-carrot-eggs.jpg",
  "菠菜炒鸡蛋": "spinach-eggs.jpg",
  "葱花煎蛋": "scallion-fried-egg-alt.jpg",
  "西葫芦炒鸡蛋": "zucchini-eggs.jpg",
  "酱汁荷包蛋": "sauced-egg.jpg",
  "韭菜炒鸡蛋": "chive-eggs.jpg",
  "韭黄炒鸡蛋": "yellow-chive-eggs.jpg",
  "家常豆腐": "home-style-tofu.jpg",
  "抱蛋豆腐": "tofu-egg.jpg",
  "红烧素鸡": "braised-vegetarian-chicken.jpg",
  "红烧面结": "braised-tofu-knot.jpg",
  "肉沫豆腐": "minced-pork-tofu.jpg",
  "芹菜炒香干": "celery-dried-tofu.jpg",
  "菌菇豆腐煲": "mushroom-tofu-pot.jpg",
  "葱油面结": "audit-3320927.jpg",
  "家常炒素鸡": "greenpepper-vegetarian-chicken.jpg",
  "葱烧豆腐": "scallion-tofu.jpg",
  "豆芽炒香干": "bean-sprouts-dried-tofu.jpg",
  "铁板豆腐": "ironplate-tofu.jpg",
  "香煎豆腐": "pan-fried-tofu.jpg",
  "三杯鸡": "three-cup-chicken.jpg",
  "咸蛋黄鸡翅": "salted-yolk-wings.jpg",
  "啤酒鸭": "beer-duck.jpg",
  "土豆鸡块": "potato-chicken.jpg",
  "奥尔良鸡翅": "orleans-wings.jpg",
  "奥尔良鸡腿": "orleans-drumsticks.jpg",
  "姜母鸭": "ginger-mother-duck.jpg",
  "姜焖鸭": "ginger-braised-duck.jpg",
  "香菇炖鸡": "chicken-mushroom-stew.jpg",
  "板栗烧鸡": "chestnut-braised-chicken.jpg",
  "红烧鸡爪": "braised-chicken-feet.webp",
  "虎皮鸡爪": "audit-3324960.jpg",
  "葱油鸡": "scallion-oil-chicken.jpg",
  "白斩鸡": "white-cut-chicken.jpg",
  "白斩鸭": "white-cut-duck.jpg",
  "白斩鹅": "audit-white-cut-goose.jpg",
  "烤鸡": "roast-chicken.jpg",
  "烤鸭": "roast-duck.jpg",
  "烤鹅": "roast-goose.jpg",
  "蒜香鸡翅": "audit-3343281.jpg",
  "爆炒鸡杂": "stir-fried-chicken-offal.jpg",
  "椒盐鸡翅": "audit-3326057.jpg",
  "柠檬香煎鸡翅": "lemon-pan-fried-chicken-wings.jpg",
  "椒盐鹌鹑": "salt-pepper-quail.jpg",
  "红烧鹌鹑": "braised-quail.jpg",
  "胡椒鸡煲": "pepper-chicken-claypot.jpg",
  "麻油鸭": "sesame-oil-duck.jpg",
  "酱板鸭": "sauce-board-duck.jpg",
  "葱姜炒鸡": "audit-3127300.jpg",
  "照烧鸡腿": "teriyaki-chicken-thigh.jpg",
  "蒜香鸡爪": "garlic-chicken-feet.jpg",
  "苹果炖鸡": "apple-chicken-soup.jpg",
  "干蒸鸡": "audit-3099993.jpg",
  "鸡翅鸡爪鲜虾煲": "chicken-feet-shrimp-pot.jpg",
  "爆炒牛蛙": "stir-fried-bullfrog.jpg",
  "爆炒田鸡": "stir-fried-bullfrog.jpg",
  "蒜香牛蛙": "audit-3268913.jpg",
  "蒜香田鸡": "garlic-bullfrog.png",
  "红烧牛蛙": "braised-bullfrog.jpg",
  "红烧田鸡": "braised-bullfrog.jpg",
  "椒盐牛蛙": "salt-pepper-bullfrog.jpg",
  "椒盐田鸡": "salt-pepper-bullfrog.jpg",
  "牛蛙煲": "bullfrog-claypot.jpg",
  "田鸡煲": "bullfrog-claypot.jpg",
  "咸蛋黄南瓜": "salted-yolk-pumpkin.jpg",
  "鱼香茄子": "fish-fragrant-eggplant.jpg",
  "肉末茄子": "minced-eggplant.jpg",
  "红烧冬瓜": "braised-winter-melon.jpg",
  "土豆烧茄子": "audit-3358285.jpg",
  "西红柿炒西葫芦": "tomato-zucchini.jpg",
  "丝瓜炒毛豆": "luffa-edamame.jpg",
  "白灼秋葵": "blanched-okra.jpg",
  "香菇炒芦笋": "audit-shiitake-asparagus.jpg",
  "茭白炒毛豆": "water-bamboo-edamame.jpg",
  "芹菜炒肉丝": "celery-shredded-pork.png",
  "玉米青豆胡萝粒": "audit-2064281.jpg",
  "清炒玉米粒": "stir-fried-corn-kernels.jpg",
  "红烧猪排": "braised-pork-chop.jpg",
  "干蒸牛肉": "dry-steamed-beef.jpg",
  "砂锅焗鱿鱼仔": "claypot-baby-squid.jpg"
};
const dishImageSources = {
  "砂锅焗鱿鱼仔": {
    "label": "Foodle《Seasoned Baby Squid Clay Pot》",
    "url": "https://foodle.pro/restaurants/taipei/ashin"
  },
  "清炒玉米粒": {
    "label": "方太幸福家《葱香玉米粒》",
    "url": "https://hsadmin.fotile.com/h5happylife/menu/menudetail.html?id=7205"
  },
  "红烧猪排": {
    "label": "百度经验《猪排怎么做更好吃》",
    "url": "https://jingyan.baidu.com/showlist/detail/acf728fd06f0c4f8e510a3c0"
  },
  "干蒸牛肉": {
    "label": "搜狐《干蒸牛肉》",
    "url": "https://www.sohu.com/a/889292682_121083585"
  },
  "香菇炒芦笋": {
    "label": "Kiki《香菇炒芦笋》",
    "url": "https://kikimilk2.pixnet.net/blog/posts/15340019985"
  },
  "茭白炒毛豆": {
    "label": "酒徒《茭白炒毛豆》",
    "url": "https://note.com/chijintianxia/n/nc8a2cdf33051"
  },
  "芹菜炒肉丝": {
    "label": "ASIAN SAVOR《芹菜肉丝》",
    "url": "https://asiansavor.com.au/products/芹菜肉丝-shredded-pork-with-celery"
  },
  "玉米青豆胡萝粒": {
    "label": "三色豆",
    "url": "https://m.douguo.com/cookbook/2064281.html"
  },
  "土豆烧茄子": {
    "label": "#跟着宿舍明星学做菜#土豆烧茄子",
    "url": "https://m.douguo.com/cookbook/3358285.html"
  },
  "西红柿炒西葫芦": {
    "label": "年灵网《炒西葫芦》",
    "url": "https://www.nianling.net/changshi/oYnEqMgEVX.html"
  },
  "丝瓜炒毛豆": {
    "label": "酒徒《丝瓜毛豆》",
    "url": "https://note.com/chijintianxia/n/nb51310c522b0"
  },
  "白灼秋葵": {
    "label": "搜狐白灼秋葵示意图",
    "url": "https://www.sohu.com/a/728256078_120203703"
  },
  "咸蛋黄南瓜": {
    "label": "愛料理《金沙南瓜》",
    "url": "https://icook.tw/recipes/377245"
  },
  "鱼香茄子": {
    "label": "新浪新闻《家常菜鱼香茄子》",
    "url": "https://k.sina.cn/article_5286895728_13b1fa070001002xj1.html"
  },
  "肉末茄子": {
    "label": "天极网《肉末茄子》",
    "url": "https://dh.yesky.com/224/721893224.shtml"
  },
  "红烧冬瓜": {
    "label": "豆果美食《红烧冬瓜》",
    "url": "https://m.douguo.com/cookbook/1658032.html"
  },
  "爆炒牛蛙": {
    "label": "搜狐《爆炒牛蛙》",
    "url": "https://www.sohu.com/a/782032629_121902227"
  },
  "爆炒田鸡": {
    "label": "爆炒牛蛙图片作为同做法示意图",
    "url": "https://www.sohu.com/a/782032629_121902227"
  },
  "蒜香牛蛙": {
    "label": "蒜香牛蛙",
    "url": "https://m.douguo.com/cookbook/3268913.html"
  },
  "蒜香田鸡": {
    "label": "牛蛙煲图片作为近似做法示意图",
    "url": "https://jiameng.baidu.com/content/detail/225538052749"
  },
  "红烧牛蛙": {
    "label": "搜狐《口味牛蛙》红烧做法示意图",
    "url": "https://www.sohu.com/a/708256571_121119260"
  },
  "红烧田鸡": {
    "label": "红烧牛蛙图片作为同做法示意图",
    "url": "https://www.sohu.com/a/708256571_121119260"
  },
  "椒盐牛蛙": {
    "label": "豆果美食《椒盐牛蛙》",
    "url": "https://m.douguo.com/cookbook/1671592.html"
  },
  "椒盐田鸡": {
    "label": "椒盐牛蛙图片作为同做法示意图",
    "url": "https://m.douguo.com/cookbook/1671592.html"
  },
  "牛蛙煲": {
    "label": "En Primeur Club 牛蛙砂锅图片",
    "url": "https://www.enprimeurclub.com/restaurants/wing-lee-restaurant-yuexiu-guangzhou-restaurant"
  },
  "田鸡煲": {
    "label": "牛蛙砂锅图片作为相近食材示意图",
    "url": "https://www.enprimeurclub.com/restaurants/wing-lee-restaurant-yuexiu-guangzhou-restaurant"
  },
  "干蒸鸡": {
    "label": "干蒸鸡",
    "url": "https://m.douguo.com/cookbook/3099993.html"
  },
  "鸡翅鸡爪鲜虾煲": {
    "label": "Cookidoo《鸡爪烧虾煲》示意图，未含鸡翅",
    "url": "https://cookidoo.tw/recipes/recipe/zh-Hant/r907846"
  },
  "葱姜炒鸡": {
    "label": "葱姜炒鸡",
    "url": "https://m.douguo.com/cookbook/3127300.html"
  },
  "照烧鸡腿": {
    "label": "新浪新闻《照烧鸡腿饭》；图片含米饭与青菜",
    "url": "https://k.sina.com.cn/article_6424670263_17ef0b0370010117gh.html"
  },
  "蒜香鸡爪": {
    "label": "搜狐《蒜香鸡爪》",
    "url": "https://www.sohu.com/a/537737926_405428"
  },
  "苹果炖鸡": {
    "label": "愛料理《蘋果雞湯》相近菜式示意图",
    "url": "https://icook.tw/recipes/364362"
  },
  "胡椒鸡煲": {
    "label": "搜狐《砂锅胡椒鸡》",
    "url": "https://www.sohu.com/a/721638094_100140727"
  },
  "麻油鸭": {
    "label": "三一商店《麻油燜鴨》",
    "url": "https://www.sanyishop.net/products/麻油燜鴨"
  },
  "酱板鸭": {
    "label": "买购网《长沙传统美食酱板鸭》",
    "url": "https://www.maigoo.com/citiao/136801.html"
  },
  "椒盐鸡翅": {
    "label": "椒盐鸡翅",
    "url": "https://m.douguo.com/cookbook/3326057.html"
  },
  "柠檬香煎鸡翅": {
    "label": "Nadia《手羽中旨盐柠檬烧》示意图",
    "url": "https://oceans-nadia.com/user/682703/recipe/457886"
  },
  "椒盐鹌鹑": {
    "label": "Studio Kitchen《Chinese Crispy Quail》",
    "url": "https://studiokitchen.com.au/recipe/chinese-crispy-quail/"
  },
  "红烧鹌鹑": {
    "label": "李锦记《Braised Quails in Soy and Oyster Sauce》",
    "url": "https://au.lkk.com/en/foodservices/recipes/braised-quails-in-soy-and-oyster-sauce"
  },
  "蒜香鸡翅": {
    "label": "蒜香鸡翅",
    "url": "https://m.douguo.com/cookbook/3343281.html"
  },
  "爆炒鸡杂": {
    "label": "新浪财经《鸡杂炒椒》示意图",
    "url": "https://finance.sina.com.cn/jjxw/2024-10-19/doc-incszyac4669720.shtml"
  },
  "葱油鸡": {
    "label": "Buydeem《葱油鸡》",
    "url": "https://cn.buydeem.com/blogs/recipes/scallion-oil-chicken"
  },
  "白斩鸡": {
    "label": "什么值得买《广东白切鸡》",
    "url": "https://post.smzdm.com/p/a7gxe8d5/"
  },
  "白斩鸭": {
    "label": "新浪新闻《广东白切鸭》",
    "url": "https://k.sina.cn/article_7042090937_1a3bdc7b900100jm8i.html"
  },
  "白斩鹅": {
    "label": "白切鹅肉",
    "url": "https://qzhyxx.com/tupian/%E7%99%BD%E5%88%87%E9%B9%85%E8%82%89.html"
  },
  "烤鸡": {
    "label": "爱料理《香料烤全雞》",
    "url": "https://icook.tw/recipes/303267"
  },
  "烤鸭": {
    "label": "Our China Story《Peking duck》",
    "url": "https://www.ourchinastory.com/en/16432/Peking-duck%3A-A-century-old-recipe-for-the-future"
  },
  "烤鹅": {
    "label": "搜狐《广东烧鸡、烧鹅、烧鸭的做法汇总》",
    "url": "https://www.sohu.com/a/428421862_120740129"
  },
  "香菇炖鸡": {
    "label": "豆果美食《小鸡炖蘑菇》示意图",
    "url": "https://m.douguo.com/recipe/amp/1677025"
  },
  "板栗烧鸡": {
    "label": "豆果美食《板栗烧鸡》",
    "url": "https://www.douguo.com/cookbook/1652863.html"
  },
  "红烧鸡爪": {
    "label": "华为浏览器资讯《红烧鸡爪》示意图",
    "url": "https://feeds-drcn.cloud.huawei.com.cn/landingpage/latest?channel=-1&cpid=666&ctype=news&docid=105117829274e3e2d194ac0_si_1214791&dy_scenario=relate&emuiver=&ifl=zh_CN&r=7794af9c702e654d7038442c8d7bc2438321b8e06954de1262c07d7c2047df13&to_app=hwbrowser"
  },
  "虎皮鸡爪": {
    "label": "虎皮鸡爪",
    "url": "https://m.douguo.com/cookbook/3324960.html"
  },
  "玉秃蒸面结": {
    "label": "下厨房《清蒸玉秃》",
    "url": "https://m.xiachufang.com/recipe/100531452/"
  },
  "酸菜鱼": {
    "label": "搜狐《南方酸菜vs北方酸菜》",
    "url": "https://www.sohu.com/a/668593429_120786035"
  },
  "蒜香黑鱼片": {
    "label": "蒜香黑鱼片",
    "url": "https://m.douguo.com/cookbook/3332376.html"
  },
  "鱼头豆腐汤": {
    "label": "新浪新闻《鱼头豆腐汤的家常做法》",
    "url": "https://k.sina.com.cn/article_7453308924_1bc4077fc00100qo9i.html"
  },
  "虾潺烧豆腐": {
    "label": "搜狐《龙头鱼烧豆腐》",
    "url": "https://www.sohu.com/a/838398020_122008955"
  },
  "葱油玉秃": {
    "label": "新浪新闻《清蒸舌鳎鱼》",
    "url": "https://k.sina.com.cn/article_6425183085_17ef8836d00100fxr9.html"
  },
  "红烧玉秃": {
    "label": "搜狐《寻味上海：舌鳎、鳎目、龙利鱼》",
    "url": "https://www.sohu.com/a/513343283_121282114"
  },
  "香煎玉秃": {
    "label": "豆果美食《煎舌头鱼》",
    "url": "https://www.douguo.com/cookbook/3189963.html"
  },
  "葱油鸦片鱼头": {
    "label": "蘇杭餐廳菜色介绍",
    "url": "https://suhung.com.tw/menu_page.php?b=3&c=66&id=409"
  },
  "砂锅焗鸦片鱼头": {
    "label": "素材天下《港式砂煲鱼头》",
    "url": "https://www.sucaisucai.com/sucai/06738935.html"
  },
  "蒜蓉粉丝对虾": {
    "label": "豆果美食《蒜蓉粉丝蒸对虾》",
    "url": "https://www.douguo.com/cookbook/1378453.html"
  },
  "清蒸对虾": {
    "label": "豆果美食《清蒸大虾》",
    "url": "https://www.douguo.com/cookbook/2981252.html"
  },
  "蒜香黄油对虾": {
    "label": "Unsplash 虾菜图片",
    "url": "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=800&h=600&fit=crop&q=75"
  },
  "清蒸罗氏虾": {
    "label": "Unsplash 清蒸虾图片",
    "url": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&h=600&fit=crop&q=75"
  },
  "椒盐对虾": {
    "label": "新食神《五彩椒盐虾》",
    "url": "http://m.xinshishen.com/caipu/20150307/126962.html"
  },
  "油焖对虾": {
    "label": "万维家电《每日一道家常菜：油焖大虾》",
    "url": "http://kitchen.ea3w.com/152/1524821.html"
  },
  "咖喱对虾": {
    "label": "搜狐《蒜蓉咖喱虾》",
    "url": "https://www.sohu.com/a/896560977_122424523"
  },
  "避风塘对虾": {
    "label": "搜狐《避风塘炒虾》",
    "url": "https://chihe.sohu.com/a/899586800_122068966"
  },
  "芥末虾球": {
    "label": "搜狐《芥末虾球》",
    "url": "https://www.sohu.com/a/891078375_100114195"
  },
  "砂锅焗对虾": {
    "label": "百度百家号《砂锅焖粉丝海虾》",
    "url": "https://baijiahao.baidu.com/s?id=1667565225462123188"
  },
  "清蒸皮皮虾": {
    "label": "搜狐《煮皮皮虾》",
    "url": "https://www.sohu.com/a/909802632_122424503"
  },
  "椒盐皮皮虾": {
    "label": "新浪新闻《微波炉椒盐皮皮虾》",
    "url": "https://k.sina.com.cn/article_6434906774_17f8ce29600100bza1.html"
  },
  "虾仁滑蛋": {
    "label": "宝宝树《虾仁滑蛋》",
    "url": "https://www.babytree.com/community/meishi/topic_39299887.html"
  },
  "虾仁蒸蛋": {
    "label": "#春日露营#虾仁蒸蛋",
    "url": "https://m.douguo.com/cookbook/3330552.html"
  },
  "西兰花炒虾仁": {
    "label": "搜狐《西兰花炒虾仁》",
    "url": "https://www.sohu.com/a/905887066_122455710"
  },
  "西芹炒虾仁": {
    "label": "百度百家号《西芹炒虾仁》",
    "url": "https://baijiahao.baidu.com/s?id=1647174624553417480"
  },
  "清蒸白蟹": {
    "label": "豆果美食《清蒸梭子蟹》",
    "url": "https://www.douguo.com/cookbook/2350425.html"
  },
  "姜葱炒白蟹": {
    "label": "搜狐《葱姜香爆梭子蟹》",
    "url": "https://www.sohu.com/a/582962654_107373"
  },
  "白蟹炒年糕": {
    "label": "19楼《白蟹炒年糕》",
    "url": "https://www.19lou.com/forum-9-thread-2781416277775295-1-1.html"
  },
  "清蒸青蟹": {
    "label": "#跟着宿舍明星学做菜#清蒸青蟹",
    "url": "https://m.douguo.com/cookbook/3356188.html"
  },
  "葱油白蟹": {
    "label": "腾讯新闻《葱油梭子蟹》",
    "url": "https://new.qq.com/rain/a/20210815a04nub00"
  },
  "砂锅焗白蟹": {
    "label": "下厨房《焗梭子蟹》",
    "url": "https://www.xiachufang.com/dish/182185260/"
  },
  "白蟹豆腐羹": {
    "label": "下厨房《梭子蟹豆腐羹》",
    "url": "https://www.xiachufang.com/recipe/106522206"
  },
  "白蟹蒸蛋": {
    "label": "下厨房《梭子蟹蒸蛋》",
    "url": "https://www.xiachufang.com/recipe/104714145/"
  },
  "毛蟹炒年糕": {
    "label": "大闸蟹炒年糕",
    "url": "https://m.douguo.com/cookbook/3007279.html"
  },
  "葱油鱿鱼": {
    "label": "Cookidoo《蔥油小卷》",
    "url": "https://cookidoo.thermomix.com/recipes/recipe/en-US/r86732"
  },
  "大蒜炒鱿鱼": {
    "label": "豆果美食《蒜蓉鱿鱼》",
    "url": "https://m.douguo.com/cookbook/2462929.html"
  },
  "蒜香干煎鱿鱼": {
    "label": "macaroni《いかのピリ辛ガーリック炒め》",
    "url": "https://macaro-ni.jp/151261"
  },
  "荷兰豆炒鱿鱼": {
    "label": "新合发《清炒花枝荷蘭豆》",
    "url": "https://www.freshmackerel.com/cook/734"
  },
  "芹菜炒鱿鱼": {
    "label": "1shop《Mực xào cần tỏi》",
    "url": "https://1shop.vn/E63fH9C4F4Ed3d7"
  },
  "红烧鲈鱼": {
    "label": "搜狐《鲈鱼百变吃法》",
    "url": "https://www.sohu.com/a/740772273_120569040"
  },
  "葱油鲈鱼": {
    "label": "什么值得买《葱油鲈鱼》",
    "url": "https://post.m.smzdm.com/p/aovew3m6/"
  },
  "砂锅焗鲈鱼": {
    "label": "Cookpad《砂鍋焗鱸魚》",
    "url": "https://cookpad.com/tw/%E9%A3%9F%E8%AD%9C/15586518"
  },
  "雪菜鲈鱼": {
    "label": "龟甲万《福菜蒸鱸魚》",
    "url": "https://kikkoman.com.tw/recipe_detal_%E7%A6%8F%E8%8F%9C%E8%92%B8%E9%B1%B8%E9%AD%9A_67"
  },
  "红烧鳜鱼": {
    "label": "华人头条《红烧鳜鱼》",
    "url": "https://www.52hrtt.com/zw/n/w/info/F1762157582396"
  },
  "砂锅焗石斑鱼": {
    "label": "名厨《生啫龙胆石斑鱼》",
    "url": "https://m.mingchu.co/foodview?id=114666"
  },
  "葱油石斑鱼": {
    "label": "Pixnet《清蒸龍膽石斑（蔥油淋魚）》",
    "url": "https://dale1128.pixnet.net/blog/posts/3041324941"
  },
  "酱爆鱿鱼": {
    "label": "新浪新闻《鱿鱼家常菜》",
    "url": "https://k.sina.cn/article_6433285613_17f7425ed00100h9np.html"
  },
  "葱油多宝鱼": {
    "label": "香哈网《清蒸多宝鱼》",
    "url": "https://m.xiangha.com/caipu/81159333.html"
  },
  "红烧昂刺鱼": {
    "label": "中文百科《酱烧昂刺鱼》",
    "url": "https://www.newton.com.tw/wiki/%E9%86%AC%E7%87%92%E6%98%82%E5%88%BA%E9%AD%9A"
  },
  "葱油黑鱼片": {
    "label": "葱油黑鱼片",
    "url": "https://m.douguo.com/cookbook/3020374.html"
  },
  "清蒸鳗鱼": {
    "label": "SnapCalorie《Steamed Eel》",
    "url": "https://www.snapcalorie.com/nutrition/steamed_eel_nutrition.html"
  },
  "红烧鳗鱼": {
    "label": "#福气年夜菜#  红烧鳗鱼",
    "url": "https://m.douguo.com/cookbook/3056123.html"
  },
  "葱姜炒鱿鱼": {
    "label": "Cookidoo《薑絲中卷》",
    "url": "https://cookidoo.international/recipes/recipe/en/r414916"
  },
  "盐水白灼对虾": {
    "label": "300.cn《白灼南美对虾》",
    "url": "https://www.300.cn/nongye/65493.html"
  },
  "雪菜昂刺鱼": {
    "label": "哔哩哔哩《雪菜才是昂刺鱼最好的归宿》",
    "url": "http://m.bilibili.com/video/BV1cU4y1J7PP/"
  },
  "砂锅焗鳜鱼": {
    "label": "豆果美食家常菜菜谱",
    "url": "https://www.douguo.com/caidan/4718799.html"
  },
  "葱油鳜鱼": {
    "label": "新浪众测《解锁千岛湖旅游的100种玩法》",
    "url": "http://zhongce.sina.com.cn/article/view/142170/"
  },
  "姜葱炒青蟹": {
    "label": "【鱼小厨：炒】姜葱炒青蟹",
    "url": "https://m.douguo.com/cookbook/1256437.html"
  },
  "砂锅焗毛蟹": {
    "label": "家常鲜食#砂锅焗大闸蟹",
    "url": "https://m.douguo.com/cookbook/3343956.html"
  },
  "毛蟹豆腐羹": {
    "label": "青豆蟹粉豆腐汤，给大闸蟹多一种可能的惊喜。",
    "url": "https://m.douguo.com/cookbook/1607264.html"
  },
  "青蟹蒸蛋": {
    "label": "5H《梭子蟹蒸鸡蛋》",
    "url": "http://www.5h.com/ys/74650.html"
  },
  "芦笋炒虾仁": {
    "label": "芦笋虾仁:夏日清爽低脂美食",
    "url": "http://mbd.baidu.com/newspage/data/dtlandingsuper?nid"
  },
  "葱烤皮皮虾": {
    "label": "葱烤皮皮虾,夏日大排档美味烧烤,照方法做,要比外面的更加鲜美",
    "url": "https://baijiahao.baidu.com/s?id=1602327034268693121"
  },
  "清蒸毛蟹": {
    "label": "#我的中秋餐桌#清蒸大闸蟹",
    "url": "https://m.douguo.com/cookbook/3340714.html"
  },
  "葱油毛蟹": {
    "label": "周末就试试这道葱油大闸蟹的做法,满满的蟹黄,鲜香味美",
    "url": "https://quanmin.baidu.com/sv?source=share-h5&pd=qm_share_search&vid=4032235922453193440"
  },
  "青蟹炒年糕": {
    "label": "青蟹炒年糕",
    "url": "https://m.douguo.com/cookbook/3130663.html"
  },
  "油焖白蟹": {
    "label": "香辣蒜蓉油焖梭子蟹",
    "url": "https://m.douguo.com/cookbook/3280966.html"
  },
  "姜葱炒毛蟹": {
    "label": "葱姜大闸蟹",
    "url": "https://m.douguo.com/cookbook/3139423.html"
  },
  "葱油昂刺鱼": {
    "label": "360 图片搜索《葱油昂刺鱼的做法》",
    "url": "http://www.xiachufang.com/recipe/105863326"
  },
  "香葱虾球": {
    "label": "360 图片搜索《【香葱虾球烧豆腐】香葱虾球烧豆腐的做法 香葱虾球烧豆腐的家常做法》",
    "url": "http://www.maigoo.com/tuku/515883.html"
  },
  "酱烧白蟹": {
    "label": "豆果美食《酱香梭子蟹》",
    "url": "https://www.douguo.com/cookbook/3213344.html"
  },
  "油焖毛蟹": {
    "label": "油焖大闸蟹#“蟹”意浓浓在京东#",
    "url": "https://m.douguo.com/cookbook/1465745.html"
  },
  "酱烧青蟹": {
    "label": "酱香青蟹",
    "url": "https://m.douguo.com/cookbook/1259571.html"
  },
  "蛤蜊蒸蛋": {
    "label": "#520，美食撩动TA的心！#蛤蜊蒸蛋",
    "url": "https://m.douguo.com/cookbook/2299186.html"
  },
  "蒜香黄油蛤蜊": {
    "label": "豆果美食《蒜香黄油蛤蜊》",
    "url": "https://m.douguo.com/cookbook/3339083.html"
  },
  "白灼花螺": {
    "label": "豆果美食《白灼花螺》",
    "url": "https://m.douguo.com/cookbook/2465523.html"
  },
  "白灼贻贝": {
    "label": "豆果美食《白灼贻贝》",
    "url": "https://m.douguo.com/cookbook/3242362.html"
  },
  "酱爆蛤蜊": {
    "label": "豆果美食《酱爆花蛤》",
    "url": "https://m.douguo.com/cookbook/3350621.html"
  },
  "白灼花甲": {
    "label": "豆果美食《白灼花甲》",
    "url": "https://m.douguo.com/cookbook/2444418.html"
  },
  "蛤蜊冬瓜汤": {
    "label": "豆果美食《冬瓜蛤蜊汤》",
    "url": "https://www.douguo.com/cookbook/3153274.html"
  },
  "葱油蛤蜊": {
    "label": "豆果美食《葱油蛤蜊》",
    "url": "https://www.douguo.com/cookbook/1680691.html"
  },
  "蛤蜊丝瓜汤": {
    "label": "豆果美食《蛤蜊丝瓜汤》",
    "url": "https://www.douguo.com/cookbook/2520749.html"
  },
  "葱油花甲": {
    "label": "豆果美食《葱油花甲》",
    "url": "https://m.douguo.com/cookbook/2527087.html"
  },
  "清蒸贻贝": {
    "label": "豆果美食《清蒸贻贝、清蒸海虹》",
    "url": "https://m.douguo.com/cookbook/3243207.html"
  },
  "蒜香黄油贻贝": {
    "label": "豆果美食《蒜香黄油贻贝》",
    "url": "https://m.douguo.com/cookbook/3243051.html"
  },
  "白灼蛤蜊": {
    "label": "豆果美食《白灼花蛤》",
    "url": "https://m.douguo.com/cookbook/1222248.html"
  },
  "清蒸花甲": {
    "label": "豆果美食《清蒸蚝油花甲》",
    "url": "https://m.douguo.com/cookbook/1530135.html"
  },
  "花甲蒸蛋": {
    "label": "豆果美食《花甲蒸蛋》",
    "url": "https://m.douguo.com/cookbook/2365739.html"
  },
  "贻贝蒸蛋": {
    "label": "豆果美食《贻贝蒸蛋》",
    "url": "https://m.douguo.com/cookbook/3243505.html"
  },
  "花甲丝瓜汤": {
    "label": "豆果美食《花甲丝瓜汤》",
    "url": "https://m.douguo.com/cookbook/2998049.html"
  },
  "贻贝丝瓜汤": {
    "label": "豆果美食《鸡蛋丝瓜贻贝汤》",
    "url": "https://m.douguo.com/cookbook/3242401.html"
  },
  "蒜蓉粉丝罗氏虾": {
    "label": "示意图，参考蒜蓉粉丝对虾",
    "url": "https://www.douguo.com/cookbook/1378453.html"
  },
  "椒盐罗氏虾": {
    "label": "示意图，参考椒盐对虾",
    "url": "http://m.xinshishen.com/caipu/20150307/126962.html"
  },
  "油焖罗氏虾": {
    "label": "示意图，参考油焖对虾",
    "url": "http://kitchen.ea3w.com/152/1524821.html"
  },
  "咖喱罗氏虾": {
    "label": "示意图，参考咖喱对虾",
    "url": "https://www.sohu.com/a/896560977_122424523"
  },
  "蒜香黄油罗氏虾": {
    "label": "示意图，参考蒜香黄油对虾",
    "url": "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=800&h=600&fit=crop&q=75"
  },
  "砂锅焗罗氏虾": {
    "label": "示意图，参考砂锅焗对虾",
    "url": "https://baijiahao.baidu.com/s?id=1667565225462123188"
  },
  "盐水白灼罗氏虾": {
    "label": "示意图，参考盐水白灼对虾",
    "url": "https://www.300.cn/nongye/65493.html"
  },
  "避风塘罗氏虾": {
    "label": "示意图，参考避风塘对虾",
    "url": "https://chihe.sohu.com/a/899586800_122068966"
  },
  "蒜蓉粉丝基围虾": {
    "label": "示意图，参考蒜蓉粉丝对虾",
    "url": "https://www.douguo.com/cookbook/1378453.html"
  },
  "清蒸基围虾": {
    "label": "示意图，参考清蒸对虾",
    "url": "https://www.douguo.com/cookbook/2981252.html"
  },
  "盐水白灼基围虾": {
    "label": "示意图，参考盐水白灼对虾",
    "url": "https://www.300.cn/nongye/65493.html"
  },
  "清蒸小白虾": {
    "label": "示意图，参考清蒸对虾",
    "url": "https://www.douguo.com/cookbook/2981252.html"
  },
  "盐水白灼小白虾": {
    "label": "示意图，参考盐水白灼对虾",
    "url": "https://www.300.cn/nongye/65493.html"
  },
  "盐水白灼皮皮虾": {
    "label": "搜狐《煮皮皮虾》",
    "url": "https://www.sohu.com/a/909802632_122424503"
  },
  "毛蟹蒸蛋": {
    "label": "#百变莓小姐#大闸蟹蒸蛋",
    "url": "https://m.douguo.com/cookbook/2362612.html"
  },
  "酱烧毛蟹": {
    "label": "红烧大闸蟹",
    "url": "https://m.douguo.com/cookbook/2984215.html"
  },
  "葱油青蟹": {
    "label": "葱油青蟹",
    "url": "https://m.douguo.com/cookbook/2490017.html"
  },
  "砂锅焗青蟹": {
    "label": "#秋天怎么吃#花椒焗青蟹",
    "url": "https://m.douguo.com/cookbook/2343109.html"
  },
  "青蟹豆腐羹": {
    "label": "三门青蟹豆腐汤",
    "url": "https://m.douguo.com/cookbook/1562246.html"
  },
  "油焖青蟹": {
    "label": "酱香青蟹参考图",
    "url": "https://m.douguo.com/cookbook/1259571.html"
  },
  "蛤蜊蛋花汤": {
    "label": "示意图，参考豆果美食《蛤蜊蛋花汤》",
    "url": "https://www.douguo.com/cookbook/1555681.html"
  },
  "花甲蛋花汤": {
    "label": "示意图，参考蛤蜊蛋花汤示意图，花甲为同类贝肉",
    "url": "https://www.douguo.com/cookbook/1555681.html"
  },
  "贻贝蛋花汤": {
    "label": "#智利贻贝中式烹法大赏#鲜香美味～贻贝菌菇蛋花汤",
    "url": "https://m.douguo.com/cookbook/3242811.html"
  },
  "花甲冬瓜汤": {
    "label": "示意图，参考冬瓜蛤蜊汤示意图，花甲为同类贝肉",
    "url": "https://www.douguo.com/cookbook/3153274.html"
  },
  "贻贝冬瓜汤": {
    "label": "#智利贻贝中式烹法大赏#贻贝冬瓜汤",
    "url": "https://m.douguo.com/cookbook/3242551.html"
  },
  "清蒸蛤蜊": {
    "label": "示意图，参考白灼花甲示意图，展示相近的清水烹贝做法",
    "url": "https://m.douguo.com/cookbook/2444418.html"
  },
  "葱姜炒蛤蜊": {
    "label": "示意图，参考葱油蛤蜊示意图，展示葱香炒贝类",
    "url": "https://www.douguo.com/cookbook/1680691.html"
  },
  "葱姜炒花甲": {
    "label": "示意图，参考葱油花甲示意图，展示葱香炒贝类",
    "url": "https://m.douguo.com/cookbook/2527087.html"
  },
  "蒜香黄油花甲": {
    "label": "示意图，参考蒜香黄油蛤蜊示意图，花甲为同类贝肉",
    "url": "https://m.douguo.com/cookbook/3339083.html"
  },
  "酱爆花甲": {
    "label": "示意图，参考酱爆蛤蜊示意图，花甲为同类贝肉",
    "url": "https://m.douguo.com/cookbook/3350621.html"
  },
  "葱油贻贝": {
    "label": "#智利贻贝中式烹法大赏# 葱油贻贝",
    "url": "https://m.douguo.com/cookbook/3242291.html"
  },
  "葱姜炒贻贝": {
    "label": "#智利贻贝中式烹法大赏#贻贝炒苔菜",
    "url": "https://m.douguo.com/cookbook/3242219.html"
  },
  "酱爆贻贝": {
    "label": "#智利贻贝中式烹法大赏#双椒爆贻贝",
    "url": "https://m.douguo.com/cookbook/3242346.html"
  },
  "清蒸花螺": {
    "label": "示意图，参考白灼花螺示意图，展示清水烹制花螺",
    "url": "https://m.douguo.com/cookbook/2465523.html"
  },
  "大虾炒鱿鱼": {
    "label": "永丰余《剑虾透抽切片组》成品",
    "url": "https://www.green-n-safe.com/Products/Content?id=FEB1149TWCA"
  },
  "砂锅焗皮皮虾": {
    "label": "参考《年夜饭皮皮虾砂锅》菜图，做法与配菜略有差异",
    "url": "https://inf.news/en/food/54a1b3747766f6506ff160fb9ca343b7.html"
  },
  "葱爆虾仁": {
    "label": "参考爱料理《蔥爆蝦仁》",
    "url": "https://icook.tw/recipes/256494"
  },
  "玉米粒炒虾仁": {
    "label": "参考玉米炒虾仁菜图",
    "url": "https://www.iituku.com/detail/8439.html"
  },
  "咸蛋黄虾仁": {
    "label": "#春日养生局#让你吃了一口就难于忘却的咸蛋黄虾仁",
    "url": "https://m.douguo.com/cookbook/3245755.html"
  },
  "椒盐虾仁": {
    "label": "豆果美食《椒盐虾仁》",
    "url": "https://www.douguo.com/cookbook/3199271.html"
  },
  "口蘑炒虾仁": {
    "label": "口蘑炒虾仁",
    "url": "https://m.douguo.com/cookbook/3359503.html"
  },
  "时蔬虾饼": {
    "label": "参考虾蔬菜饼菜图，配料与做法略有差异",
    "url": "https://www.sohu.com/a/784347199_121905573"
  },
  "砂锅盐焗蛤蜊": {
    "label": "参考砂锅焗黄沙蚬菜图，贝类品种相近",
    "url": "https://www.sohu.com/a/560925397_120967290"
  },
  "砂锅盐焗花甲": {
    "label": "示意图，参考砂锅焗黄沙蚬菜图，贝类品种相近",
    "url": "https://www.sohu.com/a/560925397_120967290"
  },
  "砂锅盐焗贻贝": {
    "label": "盐焗花蛤+淡菜",
    "url": "https://m.douguo.com/cookbook/3119106.html"
  },
  "葱油花螺": {
    "label": "花螺成品示意图；参考海南美味花螺菜图，调味做法不同",
    "url": "https://www.nanguo.com/article/1197.html"
  },
  "葱姜炒花螺": {
    "label": "参考海南美味花螺菜图，葱姜炒做法示意",
    "url": "https://www.nanguo.com/article/1197.html"
  },
  "蒜香黄油花螺": {
    "label": "参考越南蒜香黄油炒花螺菜图",
    "url": "https://vietgiaitri.com/oc-huong-xao-bo-toi-cach-lam-don-gian-ma-thom-ngon-dam-vi-20220520i6454357/"
  },
  "砂锅盐焗花螺": {
    "label": "碳炉砂锅盐焗花螺",
    "url": "https://m.douguo.com/cookbook/2451067.html"
  },
  "酱爆花螺": {
    "label": "参考海南美味花螺菜图，展示酱炒花螺",
    "url": "https://www.nanguo.com/article/1197.html"
  },
  "家烧海鲜拼盘": {
    "label": "海鲜拼盘",
    "url": "https://m.douguo.com/cookbook/1726199.html"
  },
  "砂锅海鲜拼盘": {
    "label": "海鲜砂锅",
    "url": "http://www.huitu.com/newmedia/detail/20150709/150227298900.html"
  },
  "清蒸海鲜拼盘": {
    "label": "#金龙鱼玉米油护心食谱#清蒸海鲜",
    "url": "https://m.douguo.com/cookbook/3358767.html"
  },
  "葱烧海鲜拼盘": {
    "label": "李锦记《海鲜小炒王》葱烧海鲜参考",
    "url": "https://hk.lkk.com/zh-hk/foodservices/homecooks/recipes/stir-fried-seafood-in-soy-sauce"
  },
  "红烧鸡腿": {
    "label": "豆果美食《红烧鸡腿》",
    "url": "https://m.douguo.com/cookbook/2462280.html"
  },
  "红烧鸡翅": {
    "label": "豆果美食《红烧鸡翅》",
    "url": "https://www.douguo.com/cookbook/2401350.html"
  },
  "可乐鸡翅": {
    "label": "可乐鸡翅",
    "url": "https://m.douguo.com/cookbook/3358540.html"
  },
  "黄焖鸡": {
    "label": "豆果美食《黄焖鸡》",
    "url": "https://m.douguo.com/cookbook/1393925.html"
  },
  "红烧肉": {
    "label": "豆果美食《樱桃红烧肉》",
    "url": "https://m.douguo.com/cookbook/2461293.html"
  },
  "糖醋小排": {
    "label": "#精品菜谱挑战赛#糖醋小排",
    "url": "https://m.douguo.com/cookbook/2291754.html"
  },
  "菠萝咕噜肉": {
    "label": "豆果美食《菠萝咕噜肉》",
    "url": "https://www.douguo.com/cookbook/1524394.html"
  },
  "回锅肉": {
    "label": "豆果美食《回锅肉》",
    "url": "https://m.douguo.com/cookbook/1707056.html"
  },
  "黑椒牛肉粒": {
    "label": "豆果美食《黑椒牛肉粒》",
    "url": "https://www.douguo.com/cookbook/2484718.html"
  },
  "番茄炖牛腩": {
    "label": "豆果美食《西红柿炖牛腩》",
    "url": "https://m.douguo.com/cookbook/2505755.html"
  },
  "水煮牛肉": {
    "label": "豆果美食《水煮牛肉》",
    "url": "https://www.douguo.com/cookbook/2494875.html"
  },
  "凉拌牛肉": {
    "label": "豆果美食《凉拌牛肉》",
    "url": "https://www.douguo.com/cookbook/2427457.html"
  },
  "番茄炒鸡蛋": {
    "label": "豆果美食《西红柿炒鸡蛋》",
    "url": "https://www.douguo.com/cookbook/2431846.html"
  },
  "手撕包菜": {
    "label": "豆果美食《手撕包菜》",
    "url": "https://www.douguo.com/cookbook/204419.html"
  },
  "醋溜土豆丝": {
    "label": "豆果美食《醋溜土豆丝》",
    "url": "https://www.douguo.com/cookbook/177583.html"
  },
  "皮蛋豆腐": {
    "label": "豆果美食《皮蛋豆腐》",
    "url": "https://m.douguo.com/cookbook/2466827.html"
  },
  "蒜香牛肉粒": {
    "label": "豆果美食《蒜香牛肉粒》",
    "url": "https://www.douguo.com/cookbook/213456.html"
  },
  "爆炒牛肉": {
    "label": "豆果美食《爆炒牛肉》",
    "url": "https://www.douguo.com/cookbook/2410327.html"
  },
  "红烧牛腩": {
    "label": "豆果美食《红烧牛腩》",
    "url": "https://www.douguo.com/cookbook/197080.html"
  },
  "土豆炖牛腩": {
    "label": "#金龙鱼玉米油护心食谱#土豆炖牛腩",
    "url": "https://m.douguo.com/cookbook/3357970.html"
  },
  "萝卜炖牛腩": {
    "label": "#做川菜用豪吉#萝卜炖牛腩",
    "url": "https://m.douguo.com/cookbook/3325656.html"
  },
  "洋葱炒牛肉": {
    "label": "豆果美食《咖喱洋葱炒牛肉》；咖喱调味与菜单做法不同",
    "url": "https://www.douguo.com/cookbook/180213.html"
  },
  "葱香肥牛": {
    "label": "葱烧肥牛",
    "url": "https://m.douguo.com/cookbook/3341295.html"
  },
  "土豆牛肉粒": {
    "label": "#世界杯早餐我承包#土豆牛肉粒",
    "url": "https://m.douguo.com/cookbook/3354460.html"
  },
  "芦笋炒牛肉": {
    "label": "#年夜饭菜谱# 芦笋炒牛肉",
    "url": "https://m.douguo.com/cookbook/3325912.html"
  },
  "杏鲍菇炒牛肉": {
    "label": "杏鲍菇炒牛肉",
    "url": "https://m.douguo.com/cookbook/2415278.html"
  },
  "芹菜炒牛肉": {
    "label": "#食愈体态汁划#芹菜炒牛肉",
    "url": "https://m.douguo.com/cookbook/3356464.html"
  },
  "口蘑炒牛肉": {
    "label": "#年夜饭就选外婆乡#口蘑炒牛肉",
    "url": "https://m.douguo.com/cookbook/3347660.html"
  },
  "雪菜烧牛肉": {
    "label": "雪菜牛肉丝",
    "url": "https://m.douguo.com/cookbook/3230440.html"
  },
  "苹果炖牛肋条": {
    "label": "苹果炖牛肋条（珐琅锅版）",
    "url": "https://m.douguo.com/cookbook/3356513.html"
  },
  "清炖牛肋条": {
    "label": "清炖牛肋条",
    "url": "https://m.douguo.com/cookbook/3346766.html"
  },
  "蒜香牛肋条": {
    "label": "蒜香牛肋条",
    "url": "https://m.douguo.com/cookbook/3329517.html"
  },
  "红烧牛肋条": {
    "label": "红烧牛肋条",
    "url": "https://m.douguo.com/cookbook/3358616.html"
  },
  "糖醋仔排": {
    "label": "糖醋仔排",
    "url": "https://m.douguo.com/cookbook/2419713.html"
  },
  "椒盐排骨": {
    "label": "豆果美食《椒盐排骨》",
    "url": "https://m.douguo.com/cookbook/1650653.html"
  },
  "黄焖排骨": {
    "label": "豆果美食《黄焖排骨》",
    "url": "https://m.douguo.com/cookbook/3359695.html"
  },
  "蒜香排骨": {
    "label": "豆果美食《蒜香排骨》",
    "url": "https://m.douguo.com/cookbook/3328453.html"
  },
  "清蒸排骨": {
    "label": "清蒸排骨",
    "url": "https://m.douguo.com/cookbook/3341257.html"
  },
  "红烧猪蹄": {
    "label": "红烧猪蹄",
    "url": "https://m.douguo.com/cookbook/1558677.html"
  },
  "黄豆炖猪蹄": {
    "label": "黄豆炖猪蹄",
    "url": "https://m.douguo.com/cookbook/3337157.html"
  },
  "椒盐猪蹄": {
    "label": "椒盐猪蹄",
    "url": "https://m.douguo.com/cookbook/3003247.html"
  },
  "烤猪蹄": {
    "label": "#我的2024年夜饭#烤猪蹄",
    "url": "https://m.douguo.com/cookbook/3292466.html"
  },
  "蹄花汤": {
    "label": "白汤如脂的老妈蹄花汤",
    "url": "https://m.douguo.com/cookbook/2438370.html"
  },
  "爆炒腰花": {
    "label": "新浪新闻《四川火爆腰花》",
    "url": "https://n.sinaimg.cn/sinakd20112/762/w1000h562/20221005/26b4-4eb9c77411af9b2440486219fcb78f67.jpg"
  },
  "蒜香猪排": {
    "label": "豆果美食《蒜香烤伊比利亚猪排》；猪排品种不同",
    "url": "https://m.douguo.com/cookbook/2511645.html"
  },
  "酥炸猪排": {
    "label": "豆果美食《南乳脆炸猪排》；调味略有不同",
    "url": "https://m.douguo.com/cookbook/2025663.html"
  },
  "香煎五花肉": {
    "label": "豆果美食《香煎五花肉》",
    "url": "https://m.douguo.com/cookbook/3332375.html"
  },
  "酥炸五花肉": {
    "label": "豆果美食《酥炸五花肉》",
    "url": "https://m.douguo.com/cookbook/3268538.html"
  },
  "糖醋里脊": {
    "label": "豆果美食《糖醋里脊》",
    "url": "https://m.douguo.com/cookbook/3348137.html"
  },
  "小酥肉": {
    "label": "豆果美食《小酥肉》",
    "url": "https://m.douguo.com/cookbook/2351637.html"
  },
  "白切五花肉": {
    "label": "豆果美食《白切五花肉》",
    "url": "https://m.douguo.com/cookbook/3356915.html"
  },
  "蜜汁卤肉": {
    "label": "#相聚组个局#蜜汁红烧肉",
    "url": "https://m.douguo.com/cookbook/2389814.html"
  },
  "溜肉段": {
    "label": "豆果美食《焦溜肉段》",
    "url": "https://m.douguo.com/cookbook/2457047.html"
  },
  "油豆腐烧肉": {
    "label": "豆果美食《油豆腐红烧肉》",
    "url": "https://m.douguo.com/cookbook/2472764.html"
  },
  "肉饼蒸蛋": {
    "label": "豆果美食《肉饼蒸蛋》",
    "url": "https://m.douguo.com/cookbook/2531016.html"
  },
  "五香牛杂": {
    "label": "顺德美食探店:细妹五香牛杂篇",
    "url": "http://mbd.baidu.com/newspage/data/dtlandingsuper?nid=dt_4289918416677440231"
  },
  "小炒肉": {
    "label": "豆果美食《小炒肉》",
    "url": "https://m.douguo.com/cookbook/1418974.html"
  },
  "农家一碗香": {
    "label": "豆果美食《农家一碗香》",
    "url": "https://m.douguo.com/cookbook/3338813.html"
  },
  "水煮肉片": {
    "label": "豆果美食《水煮肉片》",
    "url": "https://m.douguo.com/cookbook/3081260.html"
  },
  "葱爆猪舌": {
    "label": "豆果美食《葱爆猪舌头》",
    "url": "https://m.douguo.com/cookbook/2393894.html"
  },
  "白灼猪舌": {
    "label": "示意图，参考豆果美食《卤猪舌》，调味做法不同",
    "url": "https://m.douguo.com/cookbook/2053828.html"
  },
  "砂锅焗猪舌": {
    "label": "豆果美食《生焗猪舌》",
    "url": "https://m.douguo.com/cookbook/3251299.html"
  },
  "葱烧大排": {
    "label": "豆果美食《葱烧大排》",
    "url": "https://m.douguo.com/cookbook/3339232.html"
  },
  "苹果炖猪排": {
    "label": "豆果美食《苹果炖猪排》",
    "url": "https://m.douguo.com/cookbook/3341308.html"
  },
  "口蘑炒青菜": {
    "label": "豆果美食《口蘑炒青菜》",
    "url": "https://m.douguo.com/cookbook/1100828.html"
  },
  "香菇炒青菜": {
    "label": "豆果美食《香菇炒青菜》",
    "url": "https://m.douguo.com/cookbook/2148369.html"
  },
  "清炒空心菜": {
    "label": "豆果美食《清炒空心菜》",
    "url": "https://m.douguo.com/cookbook/2504852.html"
  },
  "清炒木耳菜": {
    "label": "豆果美食《清炒木耳菜》",
    "url": "https://m.douguo.com/cookbook/3331821.html"
  },
  "清炒菜心": {
    "label": "豆果美食《清炒菜心》",
    "url": "https://m.douguo.com/cookbook/2982948.html"
  },
  "白灼生菜": {
    "label": "豆果美食《白灼生菜》",
    "url": "https://m.douguo.com/cookbook/3359472.html"
  },
  "蚝油生菜": {
    "label": "豆果美食《蚝油生菜》",
    "url": "https://m.douguo.com/cookbook/1445529.html"
  },
  "蒜蓉油麦菜": {
    "label": "豆果美食《蒜蓉油麦菜》",
    "url": "https://m.douguo.com/cookbook/2435028.html"
  },
  "清炒菠菜": {
    "label": "豆果美食《清炒菠菜》",
    "url": "https://m.douguo.com/cookbook/2450133.html"
  },
  "清炒小白菜": {
    "label": "豆果美食《清炒小白菜苗》",
    "url": "https://m.douguo.com/cookbook/3325117.html"
  },
  "清炒娃娃菜": {
    "label": "豆果美食《清炒娃娃菜》",
    "url": "https://m.douguo.com/cookbook/1254137.html"
  },
  "清炒鸡毛菜": {
    "label": "豆果美食《清炒腐皮鸡毛菜》；含腐皮配料",
    "url": "https://m.douguo.com/cookbook/2431619.html"
  },
  "清炒西兰花": {
    "label": "豆果美食《清炒西兰花》",
    "url": "https://m.douguo.com/cookbook/3336364.html"
  },
  "清炒莴笋丝": {
    "label": "豆果美食《清炒莴笋丝》",
    "url": "https://m.douguo.com/cookbook/3298751.html"
  },
  "椒盐土豆": {
    "label": "豆果美食《椒盐土豆香肠丁》；含香肠配料",
    "url": "https://m.douguo.com/cookbook/3341839.html"
  },
  "肉沫土豆": {
    "label": "豆果美食《肉末土豆丁》",
    "url": "https://m.douguo.com/cookbook/3354133.html"
  },
  "木耳炒肉片": {
    "label": "豆果美食《木耳炒肉片》",
    "url": "https://m.douguo.com/cookbook/3327297.html"
  },
  "香菇炒肉片": {
    "label": "豆果美食《香菇炒肉》",
    "url": "https://m.douguo.com/cookbook/3328216.html"
  },
  "炸蘑菇": {
    "label": "豆果美食《干炸蘑菇》",
    "url": "https://m.douguo.com/cookbook/3326760.html"
  },
  "素炒双菇": {
    "label": "豆果美食《素炒双菇》",
    "url": "https://m.douguo.com/cookbook/2457658.html"
  },
  "蒜苔炒肉": {
    "label": "豆果美食《蒜苔炒肉》",
    "url": "https://m.douguo.com/cookbook/3359076.html"
  },
  "油焖茭白": {
    "label": "豆果美食《油焖茭白》",
    "url": "https://m.douguo.com/cookbook/2309924.html"
  },
  "清炒绿豆芽": {
    "label": "豆果美食《清炒绿豆芽》",
    "url": "https://m.douguo.com/cookbook/3093872.html"
  },
  "干煸四季豆": {
    "label": "豆果美食《干煸四季豆》",
    "url": "https://m.douguo.com/cookbook/3325170.html"
  },
  "话梅毛豆": {
    "label": "豆果美食《话梅毛豆》",
    "url": "https://m.douguo.com/cookbook/1178689.html"
  },
  "清炒荷兰豆": {
    "label": "豆果美食《清炒荷兰豆》",
    "url": "https://m.douguo.com/cookbook/3340344.html"
  },
  "豆角炒肉": {
    "label": "豆果美食《卜豆角炒肉丝》；使用腌豆角",
    "url": "https://m.douguo.com/cookbook/3356568.html"
  },
  "豇豆炒肉": {
    "label": "豆果美食《豇豆炒肉末》",
    "url": "https://m.douguo.com/cookbook/3334248.html"
  },
  "荷兰豆炒藕片": {
    "label": "豆果美食《荷兰豆炒藕片》",
    "url": "https://m.douguo.com/cookbook/3336201.html"
  },
  "彩椒炒山药": {
    "label": "彩椒清炒山药",
    "url": "https://m.douguo.com/cookbook/1194686.html"
  },
  "花菜炒肉": {
    "label": "豆果美食《花菜炒肉》",
    "url": "https://m.douguo.com/cookbook/3347596.html"
  },
  "莲藕木耳炒胡萝卜": {
    "label": "豆果美食《莲藕炒胡萝卜木耳》",
    "url": "https://m.douguo.com/cookbook/2477294.html"
  },
  "肉末土豆片": {
    "label": "香菇肉末土豆片【宝宝辅食】",
    "url": "https://m.douguo.com/cookbook/3207219.html"
  },
  "莴笋炒肉片": {
    "label": "豆果美食《莴笋炒肉片》",
    "url": "https://m.douguo.com/cookbook/3331282.html"
  },
  "炒胡萝卜丝": {
    "label": "豆果美食《辣炒胡萝卜丝》",
    "url": "https://m.douguo.com/cookbook/2397785.html"
  },
  "葱油芋艿": {
    "label": "豆果美食《葱油芋艿仔》",
    "url": "https://m.douguo.com/cookbook/1598936.html"
  },
  "家常烧茄子": {
    "label": "豆果美食《家常烧茄子》",
    "url": "https://m.douguo.com/cookbook/3356551.html"
  },
  "凉拌黄瓜": {
    "label": "豆果美食《凉拌黄瓜虾球》；图片含虾球",
    "url": "https://m.douguo.com/cookbook/3334850.html"
  },
  "三鲜菌菇汤": {
    "label": "豆果美食《三鲜菌菇汤》",
    "url": "https://m.douguo.com/cookbook/3178127.html"
  },
  "丝瓜蛋花汤": {
    "label": "豆果美食《丝瓜蛋花汤》",
    "url": "https://m.douguo.com/cookbook/3340196.html"
  },
  "冬瓜排骨汤": {
    "label": "豆果美食《冬瓜排骨汤》",
    "url": "https://m.douguo.com/cookbook/2369414.html"
  },
  "冬瓜肉圆汤": {
    "label": "豆果美食《冬瓜肉圆汤》",
    "url": "https://m.douguo.com/cookbook/3118588.html"
  },
  "小青菜肉圆汤": {
    "label": "豆果美食《小青菜肉圆汤》",
    "url": "https://m.douguo.com/cookbook/2495202.html"
  },
  "山药排骨汤": {
    "label": "豆果美食《山药玉米排骨汤》；图中含玉米",
    "url": "https://m.douguo.com/cookbook/2289999.html"
  },
  "山药骨头汤": {
    "label": "豆果美食《山药胡萝卜甜玉米大骨头汤》",
    "url": "https://m.douguo.com/cookbook/1286643.html"
  },
  "番茄菌菇汤": {
    "label": "豆果美食《番茄菌菇汤》",
    "url": "https://m.douguo.com/cookbook/3356732.html"
  },
  "番茄蛋花汤": {
    "label": "豆果美食《番茄蛋花汤》",
    "url": "https://m.douguo.com/cookbook/3323466.html"
  },
  "白菜豆腐汤": {
    "label": "豆果美食《白菜豆腐汤》",
    "url": "https://m.douguo.com/cookbook/3355081.html"
  },
  "紫菜蛋花汤": {
    "label": "紫菜蛋花汤",
    "url": "https://m.douguo.com/cookbook/3271852.html"
  },
  "肠血面结汤": {
    "label": "豆果美食《面结汤》；图片未包含肠血",
    "url": "https://m.douguo.com/cookbook/3057520.html"
  },
  "芋艿排骨汤": {
    "label": "豆果美食《芋艿排骨汤》",
    "url": "https://m.douguo.com/cookbook/1597938.html"
  },
  "芋艿骨头汤": {
    "label": "豆果美食《骨头汤》；作大骨汤示意图",
    "url": "https://m.douguo.com/cookbook/2400210.html"
  },
  "莲藕排骨汤": {
    "label": "豆果美食《红豆莲藕排骨汤》；图片含红豆",
    "url": "https://m.douguo.com/cookbook/3330802.html"
  },
  "萝卜排骨汤": {
    "label": "豆果美食《白萝卜排骨汤》",
    "url": "https://m.douguo.com/cookbook/2451913.html"
  },
  "萝卜骨头汤": {
    "label": "豆果美食《淮山红萝卜玉米骨头汤》；配料有山药和玉米",
    "url": "https://m.douguo.com/cookbook/2504969.html"
  },
  "莲藕骨头汤": {
    "label": "豆果美食《莲藕生菜骨头汤》",
    "url": "https://m.douguo.com/cookbook/1349739.html"
  },
  "潮汕牛肉汤": {
    "label": "豆果美食《潮汕牛肉汤粉》；图中含米粉",
    "url": "https://m.douguo.com/cookbook/3335435.html"
  },
  "青菜面结汤": {
    "label": "豆果美食《青菜面》；图片未包含面结",
    "url": "https://m.douguo.com/cookbook/1628011.html"
  },
  "鲜蔬芙蓉汤": {
    "label": "豆果美食《芙蓉汤》",
    "url": "https://m.douguo.com/cookbook/3271962.html"
  },
  "鲫鱼豆腐汤": {
    "label": "豆果美食《鲫鱼豆腐汤》",
    "url": "https://m.douguo.com/cookbook/3332062.html"
  },
  "黄豆猪蹄汤": {
    "label": "豆果美食《黄豆猪蹄汤》",
    "url": "https://m.douguo.com/cookbook/3339100.html"
  },
  "冬瓜骨头汤": {
    "label": "豆果美食《冬瓜骨头汤》",
    "url": "https://m.douguo.com/cookbook/3275112.html"
  },
  "菌菇汤": {
    "label": "#年夜饭菜谱#菌菇汤",
    "url": "https://m.douguo.com/cookbook/3325559.html"
  },
  "口蘑青菜汤": {
    "label": "下厨房《鲜！简！快！口蘑青菜汤》",
    "url": "https://m.xiachufang.com/recipe/106908023/"
  },
  "大葱炒鸡蛋": {
    "label": "豆果美食《大葱炒鸡蛋》",
    "url": "https://m.douguo.com/cookbook/3358559.html"
  },
  "小葱跑蛋": {
    "label": "豆果美食《葱花跑蛋》",
    "url": "https://m.douguo.com/cookbook/1231393.html"
  },
  "小葱醋炒蛋": {
    "label": "示意图，参考豆果美食《小葱炒蛋》，未展示醋调味",
    "url": "https://m.douguo.com/cookbook/3201496.html"
  },
  "水蒸蛋": {
    "label": "豆果美食《芙蓉蛋羹》",
    "url": "https://m.douguo.com/cookbook/3332198.html"
  },
  "糖醋荷包蛋": {
    "label": "豆果美食《糖醋荷包蛋》",
    "url": "https://m.douguo.com/cookbook/3359281.html"
  },
  "素鸡焖荷包蛋": {
    "label": "豆果美食《雪菜素鸡荷包蛋》；图片含雪菜",
    "url": "https://m.douguo.com/cookbook/3355285.html"
  },
  "红烧鹌鹑蛋": {
    "label": "豆果美食《红烧鸡翅根鹌鹑蛋》；图片含鸡翅根",
    "url": "https://m.douguo.com/cookbook/2313037.html"
  },
  "荷包蛋炒肉": {
    "label": "豆果美食《荷包蛋炒肉》",
    "url": "https://m.douguo.com/cookbook/3260280.html"
  },
  "萝卜包菜丝炒鸡蛋": {
    "label": "豆果美食《包菜胡萝卜丝炒鸡蛋》",
    "url": "https://m.douguo.com/cookbook/3355744.html"
  },
  "菠菜炒鸡蛋": {
    "label": "豆果美食《菠菜炒鸡蛋》",
    "url": "https://m.douguo.com/cookbook/3327058.html"
  },
  "葱花煎蛋": {
    "label": "豆果美食《葱花煎蛋》",
    "url": "https://m.douguo.com/cookbook/2454224.html"
  },
  "西葫芦炒鸡蛋": {
    "label": "豆果美食《西葫芦炒鸡蛋》",
    "url": "https://m.douguo.com/cookbook/3328378.html"
  },
  "酱汁荷包蛋": {
    "label": "豆果美食《蒜香酱汁荷包蛋》",
    "url": "https://m.douguo.com/cookbook/3250631.html"
  },
  "韭菜炒鸡蛋": {
    "label": "豆果美食《韭菜炒鸡蛋》",
    "url": "https://m.douguo.com/cookbook/3327686.html"
  },
  "韭黄炒鸡蛋": {
    "label": "豆果美食《韭黄炒鸡蛋》",
    "url": "https://m.douguo.com/cookbook/3334811.html"
  },
  "家常豆腐": {
    "label": "豆果美食《家常豆腐》",
    "url": "https://m.douguo.com/cookbook/3324159.html"
  },
  "抱蛋豆腐": {
    "label": "豆果美食《豆腐抱蛋》",
    "url": "https://m.douguo.com/cookbook/3358791.html"
  },
  "红烧素鸡": {
    "label": "豆果美食《红烧素鸡》",
    "url": "https://m.douguo.com/cookbook/3329708.html"
  },
  "红烧面结": {
    "label": "豆果美食《红烧千张结》；千张结为面结的近似示意",
    "url": "https://m.douguo.com/cookbook/1560815.html"
  },
  "肉沫豆腐": {
    "label": "豆果美食《肉沫豆腐煲》",
    "url": "https://m.douguo.com/cookbook/3332741.html"
  },
  "芹菜炒香干": {
    "label": "豆果美食《芹菜炒香干》",
    "url": "https://m.douguo.com/cookbook/3339569.html"
  },
  "菌菇豆腐煲": {
    "label": "豆果美食《虾油菌菇豆腐煲》；图片含虾油配料",
    "url": "https://m.douguo.com/cookbook/3145127.html"
  },
  "葱油面结": {
    "label": "千张包",
    "url": "https://m.douguo.com/cookbook/3320927.html"
  },
  "家常炒素鸡": {
    "label": "豆果美食《青椒炒素鸡》",
    "url": "https://m.douguo.com/cookbook/1692939.html"
  },
  "葱烧豆腐": {
    "label": "豆果美食《葱烧豆腐》",
    "url": "https://m.douguo.com/cookbook/3323999.html"
  },
  "豆芽炒香干": {
    "label": "豆果美食《低脂香干炒豆芽》",
    "url": "https://m.douguo.com/cookbook/3340451.html"
  },
  "铁板豆腐": {
    "label": "豆果美食《铁板豆腐》",
    "url": "https://m.douguo.com/cookbook/3340783.html"
  },
  "香煎豆腐": {
    "label": "豆果美食《香煎豆腐》",
    "url": "https://m.douguo.com/cookbook/1144144.html"
  },
  "三杯鸡": {
    "label": "豆果美食《三杯鸡》",
    "url": "https://m.douguo.com/cookbook/1299205.html"
  },
  "咸蛋黄鸡翅": {
    "label": "豆果美食《咸蛋黄鸡翅》",
    "url": "https://m.douguo.com/cookbook/3359255.html"
  },
  "啤酒鸭": {
    "label": "豆果美食《啤酒鸭》",
    "url": "https://m.douguo.com/cookbook/3325755.html"
  },
  "土豆鸡块": {
    "label": "豆果美食《干锅土豆鸡块》",
    "url": "https://m.douguo.com/cookbook/3326047.html"
  },
  "奥尔良鸡翅": {
    "label": "豆果美食《奥尔良烤鸡翅》",
    "url": "https://m.douguo.com/cookbook/3329229.html"
  },
  "奥尔良鸡腿": {
    "label": "豆果美食《奥尔良烤鸡腿》",
    "url": "https://m.douguo.com/cookbook/3348396.html"
  },
  "姜母鸭": {
    "label": "豆果美食《姜母鸭》",
    "url": "https://m.douguo.com/cookbook/3347062.html"
  },
  "姜焖鸭": {
    "label": "豆果美食《仔姜焖鸭》",
    "url": "https://m.douguo.com/cookbook/3093707.html"
  },
  "卤肉饭": {
    "label": "#人人能开小吃店# 卤肉饭",
    "url": "https://m.douguo.com/cookbook/2415749.html"
  },
  "葱油黄鱼": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "红烧黄鱼": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "雪菜黄鱼": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "椒盐黄鱼": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "香煎黄鱼": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "砂锅焗黄鱼": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "葱油鲳鱼": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "红烧鲳鱼": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "雪菜鲳鱼": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "鲳鱼烧年糕": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "葱油虾潺": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "红烧虾潺": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "椒盐虾潺": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "虾潺焗豆腐": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "蛋炒饭": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "咖喱饭": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "照烧鸡腿饭": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "香菇鸡肉焖饭": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "蒸南瓜": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "蒸红薯": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "蒸土豆": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  },
  "蒸玉米": {
    "label": "本地历史示意图，原始出处未记录",
    "url": ""
  }
};
const dishPhotoNotes = {
  "玉秃蒸面结": "参考图展示清蒸玉秃，图中没有面结。",
  "肠血面结汤": "参考图展示面结汤，图中未包含肠和血。",
  "鸡翅鸡爪鲜虾煲": "参考图为鸡爪鲜虾煲，图中没有鸡翅。",
  "葱油面结": "参考图展示千张包的形态，葱油做法以实际制作情况为准。",
  "葱姜炒贻贝": "参考图为贻贝炒苔菜，配菜与所点做法不同。",
  "青蟹蒸蛋": "参考图为蟹蒸蛋，蟹种以选定的青蟹为准。",
  "油焖青蟹": "参考图为酱香青蟹，油焖做法以实际制作为准。",
  "蒜蓉粉丝对虾": "这张图由“蒜蓉粉丝对虾、蒜蓉粉丝罗氏虾、蒜蓉粉丝基围虾”共用作参考，食材和做法以所选菜名为准。",
  "蒜蓉粉丝罗氏虾": "这张图由“蒜蓉粉丝对虾、蒜蓉粉丝罗氏虾、蒜蓉粉丝基围虾”共用作参考，食材和做法以所选菜名为准。",
  "蒜蓉粉丝基围虾": "这张图由“蒜蓉粉丝对虾、蒜蓉粉丝罗氏虾、蒜蓉粉丝基围虾”共用作参考，食材和做法以所选菜名为准。",
  "清蒸对虾": "这张图由“清蒸对虾、清蒸基围虾、清蒸小白虾”共用作参考，食材和做法以所选菜名为准。",
  "清蒸基围虾": "这张图由“清蒸对虾、清蒸基围虾、清蒸小白虾”共用作参考，食材和做法以所选菜名为准。",
  "清蒸小白虾": "这张图由“清蒸对虾、清蒸基围虾、清蒸小白虾”共用作参考，食材和做法以所选菜名为准。",
  "蒜香黄油对虾": "这张图由“蒜香黄油对虾、蒜香黄油罗氏虾”共用作参考，食材和做法以所选菜名为准。",
  "蒜香黄油罗氏虾": "这张图由“蒜香黄油对虾、蒜香黄油罗氏虾”共用作参考，食材和做法以所选菜名为准。",
  "椒盐对虾": "这张图由“椒盐对虾、椒盐罗氏虾”共用作参考，食材和做法以所选菜名为准。",
  "椒盐罗氏虾": "这张图由“椒盐对虾、椒盐罗氏虾”共用作参考，食材和做法以所选菜名为准。",
  "油焖对虾": "这张图由“油焖对虾、油焖罗氏虾”共用作参考，食材和做法以所选菜名为准。",
  "油焖罗氏虾": "这张图由“油焖对虾、油焖罗氏虾”共用作参考，食材和做法以所选菜名为准。",
  "咖喱对虾": "这张图由“咖喱对虾、咖喱罗氏虾”共用作参考，食材和做法以所选菜名为准。",
  "咖喱罗氏虾": "这张图由“咖喱对虾、咖喱罗氏虾”共用作参考，食材和做法以所选菜名为准。",
  "避风塘对虾": "这张图由“避风塘对虾、避风塘罗氏虾”共用作参考，食材和做法以所选菜名为准。",
  "避风塘罗氏虾": "这张图由“避风塘对虾、避风塘罗氏虾”共用作参考，食材和做法以所选菜名为准。",
  "砂锅焗对虾": "这张图由“砂锅焗对虾、砂锅焗罗氏虾”共用作参考，食材和做法以所选菜名为准。",
  "砂锅焗罗氏虾": "这张图由“砂锅焗对虾、砂锅焗罗氏虾”共用作参考，食材和做法以所选菜名为准。",
  "盐水白灼对虾": "这张图由“盐水白灼对虾、盐水白灼罗氏虾、盐水白灼基围虾、盐水白灼小白虾”共用作参考，食材和做法以所选菜名为准。",
  "盐水白灼罗氏虾": "这张图由“盐水白灼对虾、盐水白灼罗氏虾、盐水白灼基围虾、盐水白灼小白虾”共用作参考，食材和做法以所选菜名为准。",
  "盐水白灼基围虾": "这张图由“盐水白灼对虾、盐水白灼罗氏虾、盐水白灼基围虾、盐水白灼小白虾”共用作参考，食材和做法以所选菜名为准。",
  "盐水白灼小白虾": "这张图由“盐水白灼对虾、盐水白灼罗氏虾、盐水白灼基围虾、盐水白灼小白虾”共用作参考，食材和做法以所选菜名为准。",
  "酱烧青蟹": "这张图由“酱烧青蟹、油焖青蟹”共用作参考，食材和做法以所选菜名为准。",
  "蒜香黄油蛤蜊": "这张图由“蒜香黄油蛤蜊、蒜香黄油花甲”共用作参考，食材和做法以所选菜名为准。",
  "蒜香黄油花甲": "这张图由“蒜香黄油蛤蜊、蒜香黄油花甲”共用作参考，食材和做法以所选菜名为准。",
  "白灼花螺": "这张图由“白灼花螺、清蒸花螺”共用作参考，食材和做法以所选菜名为准。",
  "清蒸花螺": "这张图由“白灼花螺、清蒸花螺”共用作参考，食材和做法以所选菜名为准。",
  "酱爆蛤蜊": "这张图由“酱爆蛤蜊、酱爆花甲”共用作参考，食材和做法以所选菜名为准。",
  "酱爆花甲": "这张图由“酱爆蛤蜊、酱爆花甲”共用作参考，食材和做法以所选菜名为准。",
  "白灼花甲": "这张图由“白灼花甲、清蒸蛤蜊”共用作参考，食材和做法以所选菜名为准。",
  "清蒸蛤蜊": "这张图由“白灼花甲、清蒸蛤蜊”共用作参考，食材和做法以所选菜名为准。",
  "蛤蜊冬瓜汤": "这张图由“蛤蜊冬瓜汤、花甲冬瓜汤”共用作参考，食材和做法以所选菜名为准。",
  "花甲冬瓜汤": "这张图由“蛤蜊冬瓜汤、花甲冬瓜汤”共用作参考，食材和做法以所选菜名为准。",
  "葱油蛤蜊": "这张图由“葱油蛤蜊、葱姜炒蛤蜊”共用作参考，食材和做法以所选菜名为准。",
  "葱姜炒蛤蜊": "这张图由“葱油蛤蜊、葱姜炒蛤蜊”共用作参考，食材和做法以所选菜名为准。",
  "葱油花甲": "这张图由“葱油花甲、葱姜炒花甲”共用作参考，食材和做法以所选菜名为准。",
  "葱姜炒花甲": "这张图由“葱油花甲、葱姜炒花甲”共用作参考，食材和做法以所选菜名为准。",
  "蛤蜊蛋花汤": "这张图由“蛤蜊蛋花汤、花甲蛋花汤”共用作参考，食材和做法以所选菜名为准。",
  "花甲蛋花汤": "这张图由“蛤蜊蛋花汤、花甲蛋花汤”共用作参考，食材和做法以所选菜名为准。",
  "砂锅盐焗蛤蜊": "这张图由“砂锅盐焗蛤蜊、砂锅盐焗花甲”共用作参考，食材和做法以所选菜名为准。",
  "砂锅盐焗花甲": "这张图由“砂锅盐焗蛤蜊、砂锅盐焗花甲”共用作参考，食材和做法以所选菜名为准。",
  "葱油花螺": "这张图由“葱油花螺、葱姜炒花螺、酱爆花螺”共用作参考，食材和做法以所选菜名为准。",
  "葱姜炒花螺": "这张图由“葱油花螺、葱姜炒花螺、酱爆花螺”共用作参考，食材和做法以所选菜名为准。",
  "酱爆花螺": "这张图由“葱油花螺、葱姜炒花螺、酱爆花螺”共用作参考，食材和做法以所选菜名为准。",
  "爆炒牛蛙": "这张图由“爆炒牛蛙、爆炒田鸡”共用作参考，食材和做法以所选菜名为准。",
  "爆炒田鸡": "这张图由“爆炒牛蛙、爆炒田鸡”共用作参考，食材和做法以所选菜名为准。",
  "红烧牛蛙": "这张图由“红烧牛蛙、红烧田鸡”共用作参考，食材和做法以所选菜名为准。",
  "红烧田鸡": "这张图由“红烧牛蛙、红烧田鸡”共用作参考，食材和做法以所选菜名为准。",
  "椒盐牛蛙": "这张图由“椒盐牛蛙、椒盐田鸡”共用作参考，食材和做法以所选菜名为准。",
  "椒盐田鸡": "这张图由“椒盐牛蛙、椒盐田鸡”共用作参考，食材和做法以所选菜名为准。",
  "牛蛙煲": "这张图由“牛蛙煲、田鸡煲”共用作参考，食材和做法以所选菜名为准。",
  "田鸡煲": "这张图由“牛蛙煲、田鸡煲”共用作参考，食材和做法以所选菜名为准。",
  "蒜香田鸡": "牛蛙煲图片作为近似做法示意图；食材和做法以所选菜名为准。",
  "苹果炖鸡": "愛料理《蘋果雞湯》相近菜式示意图；食材和做法以所选菜名为准。",
  "洋葱炒牛肉": "豆果美食《咖喱洋葱炒牛肉》；咖喱调味与菜单做法不同；食材和做法以所选菜名为准。",
  "蒜香猪排": "豆果美食《蒜香烤伊比利亚猪排》；猪排品种不同；食材和做法以所选菜名为准。",
  "酥炸猪排": "豆果美食《南乳脆炸猪排》；调味略有不同；食材和做法以所选菜名为准。",
  "白灼猪舌": "示意图，参考豆果美食《卤猪舌》，调味做法不同；食材和做法以所选菜名为准。",
  "青菜面结汤": "豆果美食《青菜面》；图片未包含面结；食材和做法以所选菜名为准。",
  "红烧面结": "豆果美食《红烧千张结》；千张结为面结的近似示意；食材和做法以所选菜名为准。",
  "葱烧海鲜拼盘": "参考图为海鲜小炒王；海鲜组合和葱烧做法以家中实际制作为准。",
  "砂锅海鲜拼盘": "图片展示砂锅海鲜搭配，具体海鲜品种以实际准备为准。",
  "家烧海鲜拼盘": "图片展示海鲜拼盘，具体海鲜组合和家烧做法以实际准备为准。"
};
const directCategories = new Set(['禽类','猪肉类','牛肉类','蛋','豆制品','蔬菜类','汤类','主食']);
const menuAssetVersion = '20261111-audit-1';
const photoUrl = name => dishImages[name]+'?v='+menuAssetVersion;
const photoLabel = name => dishPhotoNotes[name]?'参考图':'示意图';
const photoCard = name => `<article class="dish-card"><button class="dish-photo-button" type="button" data-preview="${escapeText(name)}" aria-label="查看${escapeText(name)}示意图"><img src="${photoUrl(name)}" alt="${escapeText(name)}示意图" loading="lazy" decoding="async"><span class="photo-tag">${photoLabel(name)}</span></button><div class="dish-card-body"><b>${escapeText(name)}</b><button type="button" data-add="${escapeText(name)}">加入预订单</button></div></article>`;
const textDish = (name,group) => `<article class="recipe ${dishImages[name]?'with-photo':''}">${dishImages[name]?`<button class="menu-thumb" type="button" data-preview="${escapeText(name)}" aria-label="查看${escapeText(name)}示意图"><img src="${photoUrl(name)}" alt="${escapeText(name)}示意图" loading="lazy" decoding="async"><span class="thumb-caption">${dishPhotoNotes[name]?'参考':'示意'}</span></button>`:''}<div class="menu-dish-name"><b>${escapeText(name)}</b><span>${escapeText(group)} · 家宴预点</span></div><button type="button" data-add="${escapeText(name)}">加入</button></article>`;
const seafoodRecipes = openRecipes;
openRecipes = function(food){
  const dishes=catalog[activeCat].find(x=>x[0]===food)?.[1];
  if(!dishes)return seafoodRecipes(food);
  const pictured=dishes.filter(name=>dishImages[name]);
  if(!pictured.length)return seafoodRecipes(food);
  $('#categoryView').hidden=true;$('#recipeView').hidden=false;
  const plain=dishes.filter(name=>!dishImages[name]);
  $('#recipeView').innerHTML=`<div class="topbar"><button class="back" type="button" data-back>‹</button><div><h2>${escapeText(food)}怎么做？</h2><p>${dishes.length} 种做法 · 图片为示意图</p></div></div><div class="dish-grid">${pictured.map(photoCard).join('')}</div>${plain.length?`<div class="recipes">${plain.map(name=>textDish(name,food)).join('')}</div>`:''}`;
  $('#recipeView').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-back'))return openCategory(activeCat);if(b.dataset.preview)return previewDish(b.dataset.preview);if(b.dataset.add)add(b.dataset.add);};
};
style.textContent += '.dish-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;padding:0 16px 18px}.dish-card{min-width:0;overflow:hidden;border:1px solid var(--line);border-radius:17px;background:var(--paper)}.dish-photo-button{display:block;position:relative;width:100%;aspect-ratio:4/3;padding:0;border:0;background:#ece8df;overflow:hidden}.dish-photo-button img{display:block;width:100%;height:100%;object-fit:cover}.photo-tag{position:absolute;bottom:7px;left:7px;padding:3px 6px;border-radius:6px;background:#173c3ecc;color:white;font-size:11px}.dish-card-body{padding:10px;display:grid;gap:9px}.dish-card-body b{font-size:14px;line-height:1.35;min-height:38px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.dish-card-body button{border:0;border-radius:10px;min-height:42px;background:#e5f1ed;color:var(--teal);font-weight:700}.menu-intro{padding:0 16px 14px;color:var(--muted);font-size:13px}.menu-section{margin:0 16px 10px;border:1px solid var(--line);border-radius:15px;background:var(--paper);overflow:hidden}.menu-section summary{display:flex;justify-content:space-between;align-items:center;cursor:pointer;padding:15px;font-weight:700;list-style:none}.menu-section summary::-webkit-details-marker{display:none}.menu-section summary small{font-weight:400;color:var(--muted)}.menu-section-list{display:grid;gap:8px;padding:0 10px 10px}.menu-section-list .recipe{padding:10px}.photo-preview-img{display:block;width:100%;max-height:55vh;object-fit:contain;border-radius:12px;background:#eee8de}.photo-preview-note{font-size:13px;color:var(--muted)}';
style.textContent += '.recipe.with-photo{padding:9px;gap:10px}.recipe .menu-dish-name{flex:1;min-width:0}.recipe .menu-thumb{position:relative;padding:0;width:76px;height:58px;min-height:58px;flex:0 0 76px;overflow:hidden;background:#eee8de}.menu-thumb img{display:block;width:100%;height:100%;object-fit:cover}.recipe .thumb-caption{position:absolute;right:0;bottom:0;margin:0;padding:1px 4px;border-radius:4px 0 0 0;font-size:10px;color:white;background:#0008}.recipe .menu-dish-name b{display:block;line-height:1.4}.recipe.with-photo [data-add]{flex-shrink:0}';
const previewSheet=document.createElement('div');
previewSheet.className='sheet';
previewSheet.innerHTML='<section class="panel" role="dialog" aria-modal="true" aria-label="菜品示意图"><button class="close-sheet" type="button" data-close-preview>关闭</button><h2 id="previewTitle"></h2><img class="photo-preview-img" id="previewImage" alt=""><p class="photo-preview-note"><span id="previewDetail">图片为示意图，实际做法和成品以家中制作情况为准。</span> <a id="previewSource" target="_blank" rel="noopener" hidden></a></p></section>';
document.body.append(previewSheet);
previewSheet.onclick=e=>{if(e.target===previewSheet||e.target.closest('[data-close-preview]'))previewSheet.classList.remove('show');};
function previewDish(name){if(!dishImages[name])return;$('#previewTitle').textContent=name;$('#previewImage').src=photoUrl(name);$('#previewImage').alt=name+'示意图';$('#previewDetail').textContent=dishPhotoNotes[name]||'图片为菜品示意，实际成品以家中制作为准。';const src=dishImageSources[name],link=$('#previewSource');link.hidden=!src;if(src){if(src.url){link.href=src.url;}else{link.removeAttribute('href');}link.textContent='图片来源：'+src.label;}previewSheet.classList.add('show');}
home = function(){const icons={鱼:'🐟',虾:'🦐',蟹:'🦀',贝类:'🐚',海鲜拼盘:'🍲',禽类:'🍗',猪肉类:'🥩',牛肉类:'🐂',蛋:'🥚',豆制品:'🫘',蔬菜类:'🥬',汤类:'🥣',主食:'🍚',蛙类:'🐸'};const tiles=Object.entries(catalog).map(([cat,foods])=>{const direct=directCategories.has(cat);const count=foods.reduce((n,[,d])=>n+d.length,0);return `<button class="category" type="button" data-cat="${cat}"><b>${cat}</b><small>${direct?`${count} 道菜 · ${cat==='主食'?'看图选菜':'直接选菜'}`:`${foods.length} 种食材 · 先选食材`}</small><em>${icons[cat]}</em></button>`;}).join('');$('#homeContent').innerHTML=`<div class="heading"><h2>先选想吃的类别</h2><span>选菜、搜索都可以</span></div><div class="categories">${tiles}</div>`;$('#homeContent').onclick=e=>{const b=e.target.closest('[data-cat]');if(b)openCategory(b.dataset.cat);};};
const seafoodCategory=openCategory;
openCategory = function(cat){if(!directCategories.has(cat))return seafoodCategory(cat);activeCat=cat;$('#home').hidden=true;$('#recipeView').hidden=true;$('#categoryView').hidden=false;const foods=catalog[cat];const body=cat==='主食'?`<p class="menu-intro">点图片可放大查看；9 张均为菜品示意图。</p><div class="dish-grid">${foods.flatMap(([,d])=>d).map(photoCard).join('')}</div>`:foods.map(([group,dishes],i)=>`<details class="menu-section" ${i===0?'open':''}><summary>${escapeText(group)}<small>${dishes.length} 道菜　⌄</small></summary><div class="menu-section-list">${dishes.map(d=>textDish(d,group)).join('')}</div></details>`).join('');$('#categoryView').innerHTML=`<div class="topbar"><button class="back" type="button" data-back>‹</button><div><h2>${cat}</h2><p>${foods.reduce((n,[,d])=>n+d.length,0)} 道菜 · ${cat==='主食'?'看图选菜':'按分组展开挑选'}</p></div></div>${body}`;$('#categoryView').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-back'))return showHome();if(b.dataset.preview)return previewDish(b.dataset.preview);if(b.dataset.add)add(b.dataset.add);};};
search = function(q){if(!q){showHome();home();return;}$('#home').hidden=false;$('#categoryView').hidden=true;$('#recipeView').hidden=true;const rows=all().filter(x=>(x.name+x.food+x.cat).includes(q));const pictured=rows.filter(x=>dishImages[x.name]);const plain=rows.filter(x=>!dishImages[x.name]);$('#homeContent').innerHTML=`<div class="heading"><h2>搜索结果</h2><span>${rows.length} 道菜</span></div>${pictured.length?`<div class="dish-grid">${pictured.map(x=>photoCard(x.name)).join('')}</div>`:''}<div class="search-result">${plain.length?plain.map(x=>textDish(x.name,x.cat+' · '+x.food)).join(''):rows.length?'':'<div class="empty">没有找到，可使用下方“自定义菜”。</div>'}</div>`;$('#homeContent').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.preview)return previewDish(b.dataset.preview);if(b.dataset.add)add(b.dataset.add);};};
home();update();
