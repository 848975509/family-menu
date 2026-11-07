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
home();update();
