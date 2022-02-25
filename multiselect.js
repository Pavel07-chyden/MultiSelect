var style = document.createElement('style');
style.setAttribute("id", "multiselect_dropdown_styles");
style.innerHTML = `
.row {
  max-width: 325px;
}
.info {
  display: flex;
  justify-content: space-between;
}
.buttonInModel {
  grid-area: buttonOne;
  width: 70px;
  height: 25px;
  border-radius: 2px;
  background-color: rgb(25, 118, 210);
  border: 1px solid rgba(25, 118, 210, 0.5);
  font-family:Roboto, Helvetica, Arial, sans-serif;
  color: rgb(255, 255, 255);
}
.buttonInChecked {
  grid-area: buttonTwo;
  width: 70px;
  height: 25px;
  border-radius: 2px;
  border: 1px solid rgba(25, 118, 210, 0.5);
  font-family:Roboto, Helvetica, Arial, sans-serif;
  color: rgb(25, 118, 210);
}
.multiselect-dropdown{
  display: inline-block;
  padding: 2px 5px 0px 5px;
  border-radius: 4px;
  border: solid 1px #ced4da;
  background-color: white;
  position: relative;
  background-repeat: no-repeat;
  background-position: right .75rem center;
  background-size: 16px 12px;
}
.multiselect-dropdown span.optext, .multiselect-dropdown span.placeholder{
  margin-right:0.5em; 
  margin-bottom:2px;
  padding:1px 0; 
  border-radius: 4px; 
  display:inline-block;
}
.multiselect-dropdown span.optext{
  background-color:lightgray;
  padding:1px 0.75em; 
}
.multiselect-dropdown span.optext .optdel {
  float: right;
  margin: 0 -6px 1px 5px;
  font-size: 0.7em;
  margin-top: 2px;
  cursor: pointer;
  color: #666;
}
.multiselect-dropdown span.optext .optdel:hover { color: #c66;}
.multiselect-dropdown span.placeholder{
  color:#ced4da;
}
.multiselect-dropdown-list-wrapper{
  box-shadow: gray 0 3px 8px;
  z-index: 100;
  padding:2px;
  border-radius: 4px;
  border: solid 1px #ced4da;
  display: none;
  grid-template-columns: 1fr;
  grid-template-areas: 
  "input input"
  "select select"
  "buttonOne buttonTwo";
  gap: 15px 5px;
  padding: 10px;
  margin: -1px;
  position: absolute;
  top:0;
  left: 0;
  right: 0;
  background: white;
}
.multiselect-dropdown-list-wrapper .multiselect-dropdown-search{
  grid-area: input;
  margin-bottom:5px;
}
.multiselect-dropdown-list{
  grid-area: select;
  padding:2px;
  height: 15rem;
  overflow-y:auto;
  overflow-x: hidden;
}
.multiselect-dropdown-list::-webkit-scrollbar {
  width: 6px;
}
.multiselect-dropdown-list::-webkit-scrollbar-thumb {
  background-color: #bec4ca;
  border-radius:3px;
}

.multiselect-dropdown-list div{
  padding: 5px;
}
.multiselect-dropdown-list input{
  height: 1.15em;
  width: 1.15em;
  margin-right: 0.35em;  
}
.multiselect-dropdown-list div.checked{
}
.multiselect-dropdown-list div:hover{
  background-color: #ced4da;
}
.multiselect-dropdown span.maxselected {width:100%;}
.multiselect-dropdown-all-selector {border-bottom:solid 1px #999;}
`;
document.head.appendChild(style);

const result = document.querySelector('#result');
const selectedCount = 0;

function MultiselectDropdown(options) {
  var config = {
    search: true,
    height: '15rem',
    placeholder: 'select',
    txtSelected: 'selected',
    txtAll: 'All',
    txtRemove: 'Remove',
    txtSearch: 'search',
    txtBtn: 'Apply',
    btnChecked: 'Clear',
    ...options
  };
  function newEl(tag, attrs) {
    var e = document.createElement(tag);
    if (attrs !== undefined) Object.keys(attrs).forEach(k => {
      if (k === 'class') { Array.isArray(attrs[k]) ? attrs[k].forEach(o => o !== '' ? e.classList.add(o) : 0) : (attrs[k] !== '' ? e.classList.add(attrs[k]) : 0) }
      else if (k === 'style') {
        Object.keys(attrs[k]).forEach(ks => {
          e.style[ks] = attrs[k][ks];
        });
      }
      else if (k === 'text') { attrs[k] === '' ? e.innerHTML = '&nbsp;' : e.innerText = attrs[k] }
      else e[k] = attrs[k];
    });
    return e;
  }

  document.querySelectorAll("select[multiple]").forEach((el, k) => {
    el.onchange = function setResult() {
      result.innerHTML = el.selectedOptions.length
    }

    var div = newEl('div', { class: 'multiselect-dropdown', style: { width: config.style?.width ?? el.clientWidth + 'px', padding: config.style?.padding ?? '' } });
    el.style.display = 'none';
    el.parentNode.insertBefore(div, el.nextSibling);
    var btn = newEl('button', { class: 'buttonInModel', text: config.txtBtn });
    var btnChecked = newEl('button', { class: 'buttonInChecked', text: config.btnChecked });

    var listWrap = newEl('div', { class: 'multiselect-dropdown-list-wrapper' });
    var list = newEl('div', { class: 'multiselect-dropdown-list', style: { height: config.height } });
    var search = newEl('input', { class: ['multiselect-dropdown-search'].concat([config.searchInput?.class ?? 'form-control']), style: { width: '100%', display: el.attributes['multiselect-search']?.value === 'true' ? 'block' : 'none' }, placeholder: config.txtSearch });

    listWrap.appendChild(search);
    div.appendChild(listWrap);
    listWrap.appendChild(list);

    listWrap.appendChild(btn)
    listWrap.appendChild(btnChecked)


    el.loadOptions = () => {
      list.innerHTML = '';
      if (el.attributes['multiselect-select-all']?.value == 'true') {

        var op = newEl('div', { class: 'multiselect-dropdown-all-selector' })
        var ic = newEl('input', { type: 'checkbox' });
        op.appendChild(ic);
        op.appendChild(newEl('label', { text: config.txtAll }));


        op.addEventListener('click', () => {
          op.classList.toggle('checked');
          op.querySelector("input").checked = !op.querySelector("input").checked;
          var ch = op.querySelector("input").checked;
          list.querySelectorAll(":scope > div:not(.multiselect-dropdown-all-selector)")
            .forEach(i => {
              if (i.style.display !== 'none') { i.querySelector("input").checked = ch; i.optEl.selected = ch }
            });

          el.dispatchEvent(new Event('change'));
        });
        ic.addEventListener('click', (ev) => {
          ic.checked = !ic.checked;
        });
        list.appendChild(op);
      }


      Array.from(el.options).map(o => {
        if (o.selected) selectedCount += 1;
        var op = newEl('div', { class: o.selected ? 'checked' : '', optEl: o })
        var ic = newEl('input', { type: 'checkbox', checked: o.selected });
        op.appendChild(ic);
        op.appendChild(newEl('label', { text: o.text }));
        op.addEventListener('click', () => {
          op.classList.toggle('checked');
          op.querySelector("input").checked = !op.querySelector("input").checked;
          op.optEl.selected = !!!op.optEl.selected;
          el.dispatchEvent(new Event('change'));
        });
        ic.addEventListener('click', (ev) => {
          ic.checked = !ic.checked;
        });
        o.listitemEl = op;
        list.appendChild(op);
      });
      result.innerHTML = selectedCount;
      div.listEl = listWrap;

      div.refresh = () => {
        div.querySelectorAll('span.optext, span.placeholder').forEach(t => div.removeChild(t));
        var sels = Array.from(el.selectedOptions);

        if (sels.length > (el.attributes['multiselect-max-items']?.value ?? 5)) {
          div.appendChild(newEl('span', { class: ['optext', 'maxselected'], text: sels.length + ' ' + config.txtSelected }));
        }
        else {
          sels.map(x => {
            var c = newEl('span', { class: 'optext', text: x.text, srcOption: x });
            if ((el.attributes['multiselect-hide-x']?.value !== 'true'))
              c.appendChild(newEl('span', { class: 'optdel', text: '🗙', title: config.txtRemove, onclick: (ev) => { c.srcOption.listitemEl.dispatchEvent(new Event('click')); div.refresh(); ev.stopPropagation(); } }));
            div.appendChild(c);
          });
        }
        if (0 == el.selectedOptions.length) div.appendChild(newEl('span', { class: 'placeholder', text: el.attributes['placeholder']?.value ?? config.placeholder }));
      };
      div.refresh();
    }
    el.loadOptions();

    search.addEventListener('input', () => {
      list.querySelectorAll(":scope div:not(.multiselect-dropdown-all-selector)").forEach(d => {
        var txt = d.querySelector("label").innerText.toUpperCase();
        d.style.display = txt.includes(search.value.toUpperCase()) ? 'block' : 'none';
      });
    });

    div.addEventListener('click', () => {
      div.listEl.style.display = 'grid';
      search.focus();
      search.select();
    });

    document.addEventListener('click', function (event) {
      if (!div.contains(event.target)) {
        listWrap.style.display = 'none';
        div.refresh();
      }
    });

    btn.addEventListener('click', function (event) {
      event.stopPropagation(el.attributes.value)
      listWrap.style.display = 'none';
      div.refresh();

    });

    btnChecked.addEventListener('click', (ev) => {
      document.querySelectorAll("input").forEach(t => { t.checked = false });
      result.innerHTML = el.selectedCount = 0;
      let length = el.selectedOptions.length;
      let i = 0;
      while (length > i) {
        el.removeChild(el.selectedOptions[0])
        i++
      }
      div.refresh();


    });
  });

}

window.addEventListener('load', () => {
  MultiselectDropdown(window.MultiselectDropdownOptions);
});


