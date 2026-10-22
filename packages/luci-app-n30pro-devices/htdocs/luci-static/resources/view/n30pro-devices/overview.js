'use strict';
'require view';
'require rpc';
'require ui';

var scan = rpc.declare({
 object: 'deviceid', method: 'scan',
 params: ['refresh','online','limit'], expect: {'': {}}
});
function txt(v) { return v == null || v === '' ? '未知' : String(v); }
function ipv4(d) { return Array.isArray(d.ipv4) && d.ipv4.length ? d.ipv4.join(', ') : '未知'; }
function label(d) { return txt(d.hostname && d.hostname !== '-' ? d.hostname : d.mac); }
function vendor(d) {
 // The deviceid label may be a device type instead of a verified manufacturer.
 // Do not relabel a classifier output as a confirmed brand.
 return txt(d.vendor || d.manufacturer || d.oui_vendor || null);
}
function renderRows(items) {
 return items.map(function(d) {
  return E('tr', {'class':'tr'}, [
    E('td', {'class':'td'}, [E('strong', {}, [label(d)])]),
    E('td', {'class':'td'}, [vendor(d)]),
    E('td', {'class':'td'}, [ipv4(d)]),
    E('td', {'class':'td'}, [txt(d.mac)]),
    E('td', {'class':'td'}, ['待核实']),
    E('td', {'class':'td'}, [d.online === true ? '在线' : '状态待核实'])
  ]);
 });
}
return view.extend({
 load: function() { return scan(true,false,0); },
 render: function(data) {
  var devices = data && Array.isArray(data.devices) ? data.devices : [];
  var filter = E('input', { 'class':'cbi-input-text', 'placeholder':'搜索名称、MAC 或 IP', 'style':'max-width:330px'});
  var body = E('tbody',{},[]);
  function update() {
   var q=(filter.value || '').toLowerCase();
   var visible=devices.filter(function(d) {
    return [d.hostname,d.mac,(d.ipv4 || []).join(' '),d.vendor,d.manufacturer].join(' ').toLowerCase().indexOf(q)>=0;
   });
   while(body.firstChild) body.removeChild(body.firstChild);
   var rows=renderRows(visible);
   if(!rows.length) rows=[E('tr', {'class':'tr'}, [E('td',{'class':'td','colspan':6},['没有匹配的设备'])])];
   rows.forEach(function(row) { body.appendChild(row); });
  }
  filter.addEventListener('input',update);
  var refresh=E('button', {'class':'cbi-button cbi-button-action','click':function() {
   return scan(true,false,0).then(function(data2) {
    devices=data2 && Array.isArray(data2.devices) ? data2.devices : [];
    update();
   }).catch(function(err) { ui.addNotification(null,E('p',{},[String(err)]),'error'); });
  }}, ['刷新']);
  var page=E('div',{},[
   E('h2',{},['设备管理']),
   E('p',{},['整合设备识别扫描结果。厂商仅在有可靠数据时显示；当前未建立闭源 MTK 无线接口的频段映射，暂显示待核实。设备改名和限速功能将在完成后端验收后开放。']),
   E('div',{'style':'display:flex;gap:12px;flex-wrap:wrap;margin:12px 0'},[filter,refresh]),
   E('div',{'style':'overflow-x:auto'},[
    E('table',{'class':'table'},[
     E('thead',{},[E('tr',{'class':'tr table-titles'},[
      E('th',{'class':'th'},['设备名称']),E('th',{'class':'th'},['品牌/厂商']),E('th',{'class':'th'},['IPv4']),E('th',{'class':'th'},['MAC']),E('th',{'class':'th'},['连接方式']),E('th',{'class':'th'},['状态'])
     ])]),body
    ])
   ]),
   E('p',{'class':'muted'},['单设备限速目前请在 MTK EQoS 中设置；AP 桥接模式是否生效需实机验证。'])
  ]);
  update();
  return page;
 },
 handleSaveApply: null,handleSave: null,handleReset: null
});
