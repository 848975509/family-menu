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
home();update();
