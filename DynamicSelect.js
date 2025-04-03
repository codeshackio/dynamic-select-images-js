/*
 * Created by "David Adams"
 * https://codeshack.io/dynamic-select-images-html-javascript/
 * 
 * Released under the MIT license
 * 
 * Modified by 'Gabriel Książek' (McRaZick) | https://github.com/gubrus50
 * Modification: 'Implemented keyboard navigability/accessibility for DynamicSelect'
 * Date of last modification: '03/April/2025' (Timezone: UTC-0)
 */
class DynamicSelect {

    constructor(element, options = {}) {
        let defaults = {
            bootstrapForm: false, /* Requires bootstrap5 library */
            placeholder: 'Select an option',
            tabindex: 0,
            columns: 1,
            name: '',
            width: '',
            height: '',
            data: [],
            onChange: function() {}
        };
        this.options = Object.assign(defaults, options);
        this.selectElement = typeof element === 'string' ? document.querySelector(element) : element;
        for(const prop in this.selectElement.dataset) {
            if (this.options[prop] !== undefined) {
                this.options[prop] = this.selectElement.dataset[prop];
            }
        }
        this.name = this.selectElement.getAttribute('name') ? this.selectElement.getAttribute('name') : 'dynamic-select-' + Math.floor(Math.random() * 1000000);
        if (!this.options.data.length) {
            let options = this.selectElement.querySelectorAll('option');
            for (let i = 0; i < options.length; i++) {
                this.options.data.push({
                    value: options[i].value,
                    text: options[i].innerHTML,
                    img: options[i].getAttribute('data-img'),
                    selected: options[i].selected,
                    html: options[i].getAttribute('data-html'),
                    imgWidth: options[i].getAttribute('data-img-width'),
                    imgHeight: options[i].getAttribute('data-img-height')
                });
            }
        }
        this.element = this._template();
        this.selectElement.replaceWith(this.element);
        this.optionElement = this.element.querySelector('.dynamic-select-selected');
        this._handlerState = 0; // 0 = not focused and closed, 1 = focused and open, 2 = focused and closed
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
                <div class="dynamic-select-option${this.data[i].value == this.selectedValue ? ' dynamic-select-selected' : ''}${this.data[i].text || this.data[i].html ? '' : ' dynamic-select-no-text'}" data-value="${this.data[i].value}" style="width:${optionWidth}%;${this.height ? 'height:' + this.height + ';' : ''}">
                    ${optionContent}
                </div>
            `;
        }
        let template = `
            <div class="dynamic-select ${this.options.bootstrapForm && 'dynamic-select-bootstrap'} ${this.name}"${this.selectElement.id ? ' id="' + this.selectElement.id + '"' : ''} style="${this.width ? 'width:' + this.width + ';' : ''}${this.height ? 'height:' + this.height + ';' : ''}">
                <input type="hidden" name="${this.name}" value="${this.selectedValue}" tabindex="-1">
                <div class="dynamic-select-header" style="${this.width ? 'width:' + this.width + ';' : ''}${this.height ? 'height:' + this.height + ';' : ''}"><span class="dynamic-select-header-placeholder">${this.placeholder}</span></div>
                <div class="dynamic-select-options" style="${this.options.dropdownWidth ? 'width:' + this.options.dropdownWidth + ';' : ''}${this.options.dropdownHeight ? 'height:' + this.options.dropdownHeight + ';' : ''}">${optionsHTML}</div>
            </div>
        `;
        let element = document.createElement('div');

        if (this.options.bootstrapForm)
            element.classList.add('form-control', 'px-0');

        element.setAttribute('tabindex', this.options.tabindex);
        element.innerHTML = template;
        return element;
    }

    _eventHandlers() {
        this.element.querySelectorAll('.dynamic-select-option').forEach(option => {
            option.onclick = () => this.optionElement = option;
        });
        this.element.addEventListener('click', () => {
            (this._handlerState > 1)
            ? this._handlerState = 1
            : this._handlerState++;
            if ((this._handlerState > 1) && (document.activeElement === this.element))
                 this.element.querySelector('.dynamic-select-header').classList.toggle('dynamic-select-header-active');
            else this.element.querySelector('.dynamic-select-header').classList.add('dynamic-select-header-active');
        });
        this.element.addEventListener('focus', () => {
            if (!this.element.querySelector('.dynamic-select-header').classList.contains('dynamic-select-header-active'))
                 this.element.querySelector('.dynamic-select-header').classList.add('dynamic-select-header-active');
            this.optionElement = this.optionElement;
        });
        if (this.selectElement.id && document.querySelector('label[for="' + this.selectElement.id + '"]')) {
            document.querySelector('label[for="' + this.selectElement.id + '"]').onclick = () => {
                this.element.querySelector('.dynamic-select-header').classList.toggle('dynamic-select-header-active');
            }
        }

        document.addEventListener('click', event => {
            if (!event.target.closest('.' + this.name)
            &&  !event.target.closest('label[for="' + this.selectElement.id + '"]')
            &&  !event.target.closest('div:has(.' + this.name + ')')?.children[0].classList.contains(this.name))
            {
                this.element.querySelector('.dynamic-select-header').classList.remove('dynamic-select-header-active');
                this._handlerState = 0;
            }
        });

        document.addEventListener('keydown', event => {
            if (document.activeElement !== this.element) return;
            if (event.target.querySelector('.dynamic-select-header') && event.code == 'Space') {
                this.element.querySelector('.dynamic-select-header').classList.toggle('dynamic-select-header-active');
                (this._handlerState > 1)
                ? this._handlerState = 1
                : this._handlerState++;
            }
            if (!event.target.querySelector('.dynamic-select-header-active')) return;
            if (['Escape', 'Shift', 'Tab', 'ArrowUp', 'ArrowDown'].includes(event.key)) event.preventDefault();
            
            let value = this.element.querySelector('input').value;
            let index = this.data.findIndex(data => data.value == value);


            const exit = () => this.element.querySelector('.dynamic-select-header').classList.remove('dynamic-select-header-active');
        
            const nextIndex = () => { index++;
                if (index >= this.data.length && event.key == 'ArrowDown') index = 0;
                else if (index >= this.data.length && event.key == 'Tab') exit();
            };

            const prevIndex = () => { index--;
                if (index < 0 && event.key == 'ArrowUp') index = this.data.length - 1;
                else if (index < 0 && (event.key == 'Tab' && event.shiftKey == true)) exit();
            };

            const findOptionByLetter = (letter, direction) => {
                let option, text;
                try {
                    letter = letter.toLowerCase().trim();
                    option = (direction === 'next')
                        ? this.optionElement.nextElementSibling
                        : this.optionElement.previousElementSibling;
                }
                catch (error) {
                    if (!option) {
                        if (this.optionElement)
                            throw ReferenceError(`Failed to get next/previous option adjacent to optionElement ${console.warn(this.optionElement) || ''}`);
                        if (this.selectedValue !== '')
                            throw ReferenceError(`Invalid DynamicSelect option was selected ${console.warn(this.optionElement) || ''}`);
                        option = this.element.querySelector('.dynamic-select-options .dynamic-select-option') ?? (() => {
                            throw ReferenceError('No valid DynamicSelect options available in .dynamic-select-options')
                        })();
                    }
                    else throw new Error(error);
                }

                for (let i = 0; i < 2; i++) {
                    while (option) {
                        text = option.querySelector('.dynamic-select-option-text')?.textContent.toLowerCase().trim();
                        if (!text) throw ReferenceError(`Missing '.dynamic-select-option-text' child in DynamicSelect option ${console.warn(option) || ''}`);
            
                        if (text.startsWith(letter)) return option;
                        option = (direction === 'next') ? option.nextElementSibling : option.previousElementSibling;
                    }
                    option = (direction === 'next')
                        ? this.element.querySelector('.dynamic-select-options .dynamic-select-option')
                        : this.element.querySelector('.dynamic-select-options .dynamic-select-option:last-child');
                }

                return null;
            };


            if (event.key == 'Escape') return exit();
            else if (event.key == 'ArrowUp' || (event.key == 'Tab' && event.shiftKey == true)) prevIndex();
            else if (event.key == 'ArrowDown'|| event.key == 'Tab') nextIndex();
            else if (event.key.length === 1 && event.key.match(/^\p{Letter}/u))
            {
                let option = findOptionByLetter(event.key, event.shiftKey ? 'prev' : 'next');
                if (option && option !== this.optionElement) this.optionElement = option;
                return;
            }
            else return;
            
            
            let newOption = this.element.querySelectorAll('.dynamic-select-option')[index];
            if (newOption)  this.optionElement = newOption;
        });
    }

    _updateSelected() {
        if (this.selectedValue) {
            this.element.querySelector('.dynamic-select-header').innerHTML = this.element.querySelector('.dynamic-select-selected').innerHTML;
        }
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
        if (!value?.classList.contains('dynamic-select-option')) return;
        
        this.options.optionElement = value;

        this.element.querySelectorAll('.dynamic-select-selected').forEach(selected => selected.classList.remove('dynamic-select-selected'));
        this.options.optionElement.classList.add('dynamic-select-selected');
        this.element.querySelector('.dynamic-select-header').innerHTML = this.options.optionElement.innerHTML;
        this.element.querySelector('input').value = this.options.optionElement.getAttribute('data-value');
        this.data.forEach(data => data.selected = false);
        this.data.filter(data => data.value == this.options.optionElement.getAttribute('data-value'))[0].selected = true;

        this.options.onChange(
            this.options.optionElement.getAttribute('data-value'),
            this.options.optionElement.querySelector('.dynamic-select-option-text')
            ? this.options.optionElement.querySelector('.dynamic-select-option-text').innerHTML
            : '', this.options.optionElement
        );

        const containerRect = this.element.querySelector('.dynamic-select-options').getBoundingClientRect();
        const optionRect = this.options.optionElement.getBoundingClientRect();

        if (optionRect.top < containerRect.top
        ||  optionRect.bottom > containerRect.bottom
        ||  optionRect.left < containerRect.left
        ||  optionRect.right > containerRect.right)
            this.options.optionElement.scrollIntoView({ block: 'nearest' });
            
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

}
document.querySelectorAll('[data-dynamic-select]').forEach(select => new DynamicSelect(select));
