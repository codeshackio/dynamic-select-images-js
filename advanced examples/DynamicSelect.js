/*
 * Created by "David Adams"
 * https://codeshack.io/dynamic-select-images-html-javascript/
 * 
 * Released under the MIT license
 * 
 * Modified by 'Gabriel Książek' (McRaZick) | https://github.com/gubrus50
 * Contribution date: 'From 02/April/2025 To 08/April/2025 (Timezone: UTC-0)'
 * Implementation:
 *   +   added keyboard navigability/accessibility for DynamicSelect.
 *   +   added support for "disabled" attribute.
 *   -/+ replaced primary elements with custom semantic elements:
 *           this.element             = <dynamic-select> 
 *           .dynamic-select          = <selection>
 *           .dynamic-select-selected = <selected>
 *           .dynamic-select-options  = <dropdown>
 *           .dynamic-select-option   = <item>
 * 
 *   -/+ moved ID attribute FROM <selection> TO <dynamic-select>       
 *   + added support for extending classes and styles for most semantic elements.
 *   + 'new DynamicSelect()' object now inherits options from target <select> element,
 *      and can modify them. For example, by adding extra options or overwriting existing ones. 
 */

class DynamicSelect {

    constructor(element, options = {}) {
        
        this.options = {
            placeholder: 'Select an option',
            tabindex: 0,
            columns: 1,
            name: '',
            width: '',
            height: '',
            style: '',
            class: '',
            disabled: false,
            selectionStyle: '',
            selectionClass: '',
            selectedStyle: '',
            selectedClass: '',
            dropdownWidth: '',
            dropdownHeight: '',
            dropdownStyle: '',
            dropdownClass: '',
            itemsStyle: '',
            itemsClass: '',
            data: [],
            onChange: function() {}
        };
        
        this.selectElement = typeof element === 'string' ? document.querySelector(element) : element;
        this.options.disabled = (this.selectElement.hasAttribute('disabled') || this.selectElement.dataset.hasOwnProperty('disabled'));
      
        for (const prop in this.selectElement.dataset) {
            if (this.options.hasOwnProperty(prop)) {
                if (prop === 'disabled') this.options[prop] = true;
                else this.options[prop] = this.selectElement.dataset[prop];
            }
        }

        // Prioritize user defined options from DynamicSelect object over those directly defined by data attributes
        Object.assign(this.options, options);

        this.name = this.selectElement.getAttribute('name') ? this.selectElement.getAttribute('name') : 'dynamic-select-' + Math.floor(Math.random() * 1000000);
        if (!this.options.data.length) {
            let options = this.selectElement.querySelectorAll('option');
            for (let i = 0; i < options.length; i++) {
                this.options.data.push({
                    value: options[i].value,
                    text: options[i].innerHTML,
                    img: options[i].getAttribute('data-img'),
                    html: options[i].getAttribute('data-html'),
                    imgWidth: options[i].getAttribute('data-img-width'),
                    imgHeight: options[i].getAttribute('data-img-height'),
                    selected: options[i].hasAttribute('selected'),
                    disabled: options[i].hasAttribute('disabled'),
                });
            }
        }

        this.element = this._template();
        this.selectElement.replaceWith(this.element);
        this.optionElement = this.optionElement = this.selectedValue ? this.element.querySelector(`.dynamic-select-option[data-value="${this.selectedValue}"]`) : null;
        this.disabled = this.disabled;
        this._updateSelected();
        this._eventHandlers();
    }

    _template() {
        let optionsHTML = '';
        for (let i = 0; i < this.data.length; i++) {
            let optionWidth = 100 / this.columns;
            let optionContent = '';
            if (this.data[i].html) {
                optionContent = this.data[i].html;
            } else {
                optionContent = `
                    ${this.data[i].img ? `<img src="${this.data[i].img}" alt="${this.data[i].text}" class="${this.data[i].imgWidth && this.data[i].imgHeight ? 'dynamic-size' : ''}" style="${this.data[i].imgWidth ? 'width:' + this.data[i].imgWidth + ';' : ''}${this.data[i].imgHeight ? 'height:' + this.data[i].imgHeight + ';' : ''}">` : ''}
                    ${this.data[i].text ? '<span class="dynamic-select-option-text">' + this.data[i].text + '</span>' : ''}
                `;
            }
            optionsHTML += `
                <item class="dynamic-select-option${this.data[i].value == this.selectedValue ? ' dynamic-select-selected' : ''}${this.data[i].text || this.data[i].html ? '' : ' dynamic-select-no-text'}${this.options.itemsClass ? ' ' + this.options.itemsClass : ''}" data-value="${this.data[i].value}" style="width:${optionWidth}%;${this.height ? 'height:' + this.height + ';' : ''}${this.options.itemsStyle}"${this.data[i].disabled ? ' disabled' : ''}>
                    ${optionContent}
                </item>
            `;
        }
        let template = `
            <selection class="dynamic-select ${this.name} ${this.options.selectionClass}" style="${this.width ? 'width:' + this.width + ';' : ''}${this.height ? 'height:' + this.height + ';' : ''}${this.options.selectionStyle}">
                <input type="hidden" name="${this.name}" value="${this.selectedValue}" tabindex="-1">
                <selected class="dynamic-select-header ${this.options.selectedClass}" style="${this.width ? 'width:' + this.width + ';' : ''}${this.height ? 'height:' + this.height + ';' : ''}${this.options.selectedStyle}"><span class="dynamic-select-header-placeholder">${this.placeholder}</span></selected>
                <dropdown class="dynamic-select-options ${this.options.dropdownClass}" style="${this.options.dropdownWidth ? 'width:' + this.options.dropdownWidth + ';' : ''}${this.options.dropdownHeight ? 'height:' + this.options.dropdownHeight + ';' : ''}${this.options.dropdownStyle}">${optionsHTML}</dropdown>
            </selection>
        `;

        let element = document.createElement('dynamic-select');
        element.setAttribute('id', this.selectElement.id && this.selectElement.id);
        element.setAttribute('class', this.options.class);
        element.setAttribute('style', this.options.style);
        element.setAttribute('tabindex', this.tabindex);
        (this.disabled == true) &&
        element.setAttribute('disabled', '');
        element.innerHTML = template;
        return element;
    }

    _eventHandlers() {

        const getContextOfClickedTargetDynamicOption = (eventTarget) => {
            const parentOptions = eventTarget.closest('.dynamic-select-options');
            const clickedOption = eventTarget.closest('.dynamic-select-option');
            return !parentOptions
                && !clickedOption
                 ? { clicked: false }
                 : { clicked: !!parentOptions, disabled: !clickedOption } 
        }

        new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
            if (mutation.attributeName === 'disabled');
                this.disabled = this.element.hasAttribute('disabled');
        })}).observe(this.element, { attributes: true });
        
        const header = this.element.querySelector('.dynamic-select-header');
        this.open = () =>   {(!this.disabled) && header.classList.add('dynamic-select-header-active'); this.scrollToSelectedOption()}
        this.close = () =>   (!this.disabled) && header.classList.remove('dynamic-select-header-active');
        this.toggle = () => {(!this.disabled) && header.classList.toggle('dynamic-select-header-active'); this.scrollToSelectedOption()}

        this.element.querySelectorAll('.dynamic-select-option').forEach(option =>
        option.addEventListener('click', () => this.optionElement = option));

        this.element.addEventListener('click', (event) => {
            if (document.activeElement !== this.element) return;
            if (!header.classList.contains('dynamic-select-header-active')) return this.open();
            if (event.target.closest('dynamic-select'))
            {
                const option = getContextOfClickedTargetDynamicOption(event.target);
                if  (!option.clicked) return this.toggle();
                else (option.clicked && !option.disabled) && this.close();
            }
        });

        this.element.addEventListener('blur', () => setTimeout(() =>
        (!this.element.contains(document.activeElement)) && this.close(), 50));

        if (this.selectElement.id && document.querySelector(`label[for="${this.selectElement.id}"]`))
        document.querySelector(`label[for="${this.selectElement.id}"]`).onclick = () => this.toggle();

        document.addEventListener('click', event => {
            if (!event.target.closest('.' + this.name)
            &&  !event.target.closest('label[for="' + this.selectElement.id + '"]')
            &&  !event.target.closest('div:has(.' + this.name + ')')?.children[0].classList.contains(this.name)
            &&   event.target.closest('dynamic-select') !== this.element)
            {
                
                const option = getContextOfClickedTargetDynamicOption(event.target);
                if (option.clicked && !option.disabled) this.close();
            }
        });

        const reservedKeys = ['Escape', 'Enter', ' ', 'Shift', 'Tab', 'ArrowUp', 'ArrowDown'];

        document.addEventListener('keydown', event => {
            if (document.activeElement !== this.element
            || !event.target.querySelector('.dynamic-select-header.dynamic-select-header-active') && event.key == 'Tab') return;
            if (reservedKeys.includes(event.key) || event.code == 'Space') event.preventDefault();

            if (event.key == 'Enter') this.toggle();
            else if (event.key == ' '
            || event.code == 'Space') this.open();

            let newOption, direction,
            value = this.element.querySelector(`input[name="${this.name}"]`).value,
            index = this.data.findIndex(data => data.value == value),
            options = [...this.element.querySelectorAll('.dynamic-select-option')];
            if (!options) throw new Error('No valid DynamicSelect options available');
        

            const nextIndex = () => { index++;
                if (index >= this.data.length && event.key == 'ArrowDown') index = 0;
                else if (index >= this.data.length && event.key == 'Tab') this.close();
            };

            const prevIndex = () => { index--;
                if (index < 0 && event.key == 'ArrowUp') index = this.data.length - 1;
                else if (index < 0 && (event.key == 'Tab' && event.shiftKey == true)) this.close();
            };

            const findOptionByLetter = (letter, direction) => {
                letter = letter.toLowerCase().trim();

                const currentIndex = options.findIndex(opt => opt === this.optionElement);
                const step = direction === 'next' ? 1 : -1;

                // Start from current position (or beginning/end if not found)
                let start = currentIndex !== -1 ? currentIndex : (step === 1 ? -1 : options.length);

                for (let i = 1; i <= options.length; i++) {
                    const index = (start + step * i + options.length) % options.length;
                    const option = options[index];
                    const text = option.querySelector('.dynamic-select-option-text')?.textContent.toLowerCase().trim();

                    if (!text) {
                        console.warn('Missing .dynamic-select-option-text in option', option);
                        continue;
                    }

                    if (text.startsWith(letter) && !option.hasAttribute('disabled')) return option;
                }
                return null;
            };


            if (event.key == 'Escape') {
                return this.close();
            }
            else if (event.key == 'ArrowUp' || (event.key == 'Tab' && event.shiftKey == true)) {
                direction = 'prev'; prevIndex();
            }
            else if (event.key == 'ArrowDown' || event.key == 'Tab') {
                direction = 'next'; nextIndex();
            }
            else if (event.key.length === 1 && event.key.match(/^\p{Letter}/u)) {
                direction = event.shiftKey ? 'prev' : 'next';
                newOption = findOptionByLetter(event.key, direction);
                if (newOption
                &&  newOption !== this.optionElement
                && !newOption.hasAttribute('disabled')) this.optionElement = newOption;
                return;
            }
            else return;
    
            
            for (let i = 0; i < options.length; i++) {
                    newOption = options[index];
                if (newOption
                && !newOption.hasAttribute('disabled')) return this.optionElement = newOption;
                
                else direction === 'next' ? nextIndex() : prevIndex();
            }
        });
    }

    _updateSelected() {
        if (this.selectedValue) {
            this.element.querySelector('.dynamic-select-header').innerHTML = this.element.querySelector('.dynamic-select-selected').innerHTML;
        }
    }

    scrollToSelectedOption() {
        if (!this.options.optionElement) return;
        const containerRect = this.element.querySelector('.dynamic-select-options').getBoundingClientRect();
        const optionRect = this.options.optionElement.getBoundingClientRect();

        if (optionRect.top < containerRect.top
        ||  optionRect.bottom > containerRect.bottom
        ||  optionRect.left < containerRect.left
        ||  optionRect.right > containerRect.right)
            this.options.optionElement.scrollIntoView({ block: 'nearest' });
    }

    get selectedValue() {
        let selected = this.data.filter(option => option.selected);
        selected = selected.length ? selected[0].value : '';
        return selected;
    }

    set data(value) {
        this.options.data = value;
    }

    get data() {
        return this.options.data;
    }

    set selectElement(value) {
        this.options.selectElement = value;
    }

    get selectElement() {
        return this.options.selectElement;
    }

    set optionElement(value) {
        if (!value?.classList.contains('dynamic-select-option')
        || value.hasAttribute('disabled')
        || this.element.hasAttribute('disabled')) return;

        this.options.optionElement = value;

        this.element.querySelectorAll('.dynamic-select-selected').forEach(selected => selected.classList.remove('dynamic-select-selected'));
        this.options.optionElement.classList.add('dynamic-select-selected');
        this.element.querySelector('.dynamic-select-header').innerHTML = this.options.optionElement.innerHTML;
        this.element.querySelector(`input[name="${this.name}"]`).value = this.options.optionElement.getAttribute('data-value');
        this.data.forEach(data => data.selected = false);
        this.data.filter(data => data.value == this.options.optionElement.getAttribute('data-value'))[0].selected = true;
        
        this.options.onChange(
            this.options.optionElement.getAttribute('data-value'),
            this.options.optionElement.querySelector('.dynamic-select-option-text') ?
            this.options.optionElement.querySelector('.dynamic-select-option-text').innerHTML : '',
            this.options.optionElement
        );

        this.scrollToSelectedOption();
        this.element.querySelectorAll('.dynamic-select-option').forEach(option => option.classList.remove('focus'));
        this.optionElement.classList.toggle('focus');
    }

    get optionElement() {
        return this.options.optionElement;
    }

    set element(value) {
        this.options.element = value;
    }

    get element() {
        return this.options.element;
    }

    set placeholder(value) {
        this.options.placeholder = value;
    }

    get placeholder() {
        return this.options.placeholder;
    }

    set tabindex(value) {
        this.options.tabindex = value;
    }

    get tabindex() {
        return this.options.tabindex;
    }

    set columns(value) {
        this.options.columns = value;
    }

    get columns() {
        return this.options.columns;
    }

    set name(value) {
        this.options.name = value;
    }

    get name() {
        return this.options.name;
    }

    set width(value) {
        this.options.width = value;
    }

    get width() {
        return this.options.width;
    }

    set height(value) {
        this.options.height = value;
    }

    get height() {
        return this.options.height;
    }

    set disabled(value) {
        this.options.disabled = value;
        this.disabled == true
        ? this.element.querySelector(`input[name="${this.name}"]`).setAttribute('disabled','')
        : this.element.querySelector(`input[name="${this.name}"]`).removeAttribute('disabled');
    }

    get disabled() {
        return this.options.disabled;
    }
}

document.querySelectorAll('[data-dynamic-select]').forEach(select => new DynamicSelect(select));