# Dynamic Select with Images

A simple and easy-to-use dynamic select with images using HTML and JavaScript. This project allows you to create a dynamic select dropdown that displays images alongside the options, enhancing user experience and adding a visual touch to dropdown menus.

The complete guide and reference is available here: [https://codeshack.io/multi-select-dropdown-html-javascript/](https://codeshack.io/dynamic-select-images-html-javascript/)

## Features

- Dynamic select dropdown with images
- Customizable placeholder text
- Multiple columns for dropdown options
- Custom HTML content for options
- Semantic naming convension
- Easy integration with existing forms
- Navigability with tabulation and UP/DOWN arrow keys
- Toggle, Open & Close with keyboard buttons: **Enter**, **Spacebar** & **Esc**
- Search by first letter using any keyboard buttons (a-z, 0-9 + supports UNICODE)
- Reverse search by holding **shift** key
- Disable functionality of dynamic select element and any option from the dropdown in realtime
- Lightweight and fast

## Screenshot

![Screenshot of Multi Select Dropdown](assets/screenshot.png)

## Quick Start

1. Download the latest stable version from the releases section.

2. Include the necessary CSS and JavaScript files in your project:
    ```html
    <link href="DynamicSelect.css" rel="stylesheet" type="text/css">
    <script src="DynamicSelect.js"></script>
    ```

3. Initialize the dynamic select element in your HTML file:
    ```html
    <select id="dynamic-select" name="example-select" data-placeholder="Select an option" data-dynamic-select>
      <option value="1" data-img="path/to/image1.jpg">Option 1</option>
      <option value="2" data-img="path/to/image2.png" disabled>Option 2</option>
      <option value="3" data-img="path/to/image3.svg">Option 3</option>
    </select>
    ```

4. **Optional**: Initialize the dynamic select with JavaScript:
    ```javascript
    new DynamicSelect('#dynamic-select', {
        width: '200px',
        height: '40px',
        columns: 1,
        placeholder: 'Select an option',
        onChange: function(value, text, option) {
            console.log(value, text, option);
        }
    });
    ```

`new DynamicSelect()` object inherits attribute data from the target element. Hence property: **placeholder**, overwrites dataset attribute: **data-placeholder**.

Additionally, **class** and **style** attributes are reserved for the `<select>` element in case **DynamicSelect** object fails to convert the target select element to `<dynamic-select>`. Use dataset attributes: **data-style** and **data-class** to appropriately style the `<dynamic-select>` element.


## Usage

### Basic Example

To use this dynamic select with images in your project, follow these steps:

1. **Include the necessary HTML structure:**
    ```html
    <select id="dynamic-select">
        <option value="1" data-img="path/to/image1.jpg">Option 1</option>
        <option value="2" data-img="path/to/image2.jpg">Option 2</option>
        <option value="3" data-img="path/to/image3.jpg">Option 3</option>
    </select>
    ```

2. **Initialize the dynamic select with JavaScript:**
    ```javascript
    new DynamicSelect('#dynamic-select', {
        placeholder: 'Select an option',
        tabindex: 0,
        columns: 1,
        width: '300px',
        height: '40px',
        data: [
            { value: '1', text: 'Option 1', img: 'path/to/image1.jpg' },
            { value: '2', text: 'Option 2', img: 'path/to/image2.jpg' },
            { value: '3', text: 'Option 3', img: 'path/to/image3.jpg' }
        ],
        onChange: function(value, text, option) {
            console.log(value, text, option);
        }
    });
    ```

### Advanced Example with Custom HTML Content

You can also use custom HTML content for the options:

```html
<select id="custom-select">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
</select>
```

```javascript
new DynamicSelect('#custom-select', {
    placeholder: 'Select an option',
    data: [
        {
            value: '1',
            html: '<img src="path/to/image1.jpg" alt="Option 1"><span class="dynamic-select-option-text">Option 1</span>'
        },
        {
            value: '2',
            html: '<img src="path/to/image2.jpg" alt="Option 2"><span class="dynamic-select-option-text">Option 2</span>'
        },
        {
            value: '3',
            html: '<img src="path/to/image3.jpg" alt="Option 3"><span class="dynamic-select-option-text">Option 3</span>'
        }
    ],
    onChange: function(value, text, option) {
        console.log(value, text, option);
    }
});
```

```html
<span class="dynamic-select-option-text">Option N</span>
```

Custom defined HTML context data of `<item>` element requires an instance of `.dynamic-select-option-text` for the element that holds text data. This enhances search functionality by allowing clients to filter options based on the first letter, which is ideal for selection with a wide variety of options, such as: selecting location data - country / state / province / district / county / city...

**More Advanced Examples** - https://jsfiddle.net/sat6h1r4/


### Example with Multiple Columns

For dropdown options to be displayed in multiple columns:

```html
<select id="multi-column-select"></select>
```

```javascript
new DynamicSelect('#multi-column-select', {
    columns: 3,
    height: '100px',
    width: '160px',
    dropdownWidth: '400px',
    placeholder: 'Select a photo',
    data: [
        { value: '1', img: 'path/to/image1.jpg', imgWidth: '100px', imgHeight: '80px' },
        { value: '2', img: 'path/to/image2.jpg', imgWidth: '100px', imgHeight: '80px' },
        { value: '3', img: 'path/to/image3.jpg', imgWidth: '100px', imgHeight: '80px' },
        { value: '4', img: 'path/to/image4.jpg', imgWidth: '100px', imgHeight: '80px' },
        { value: '5', img: 'path/to/image5.jpg', imgWidth: '100px', imgHeight: '80px' },
        { value: '6', img: 'path/to/image6.jpg', imgWidth: '100px', imgHeight: '80px' }
    ],
    onChange: function(value, text, option) {
        console.log(value, text, option);
    }
});
```

It is useful if you want to populate images in a grid-like view.

## Configuration

To customize the dynamic select with images, you can modify the HTML and JavaScript as needed. The following options are available:

- `placeholder`: Placeholder text for the select element.
- `tabindex`: Tabindex attribute for the `<dynamic-select>`.
- `columns`: Number of columns in the dropdown.
- `name`: Name attribute for the `<selection>`'s `<input>` element.
- `disabled`: Disabled attribute for the `<dynamic-select>` element.
<hr>

**NOTE** - Added `disabled` **attribute** to `<dynamic-select>` also disables `<selection>`'s `<input>`.<br>Additionally, `disabled` **property** requires a boolean value for it to be initialized and updated.
<hr>

- `style`: Style attribute for the `<dynamic-select>` element.
- `class`: Class attribute for the `<dynamic-select>` element.
- `width`: Width attribute for the `<selection>` element.
- `height`: Height attribute for the `<selection>` element.
- `selectionStyle`: Style attribute for the `<selection>` element.
- `selectionClass`: Class attribute for the `<selection>` element.
- `selectedStyle`: Style attribute for the `<selected>` element.
- `selectedClass`: Class attribute for the `<selected>` element.
<hr>

- `dropdownWidth`: Width attribute for the `<dropdown>` element.
- `dropdownHeight`: Height attribute for the `<dropdown>` element.
- `dropdownStyle`: Style attribute for the `<dropdown>` element.
- `dropdownClass`: Class attribute for the `<dropdown>` element.
- `itemsStyle`: Style attribute for all instances of the `<item>` element.
- `itemsClass`: Class attribute for all instances of the `<item>` element.
<hr>

**NOTE** - Any **style** or **class** option, for example: **dropdownClass**, overwrites its defined properties: width, height, 
 and any styles from the *"DynamicSelect.css"* stylesheet. 
<hr>

- `data`: Array of objects representing the select options: `<item>` element.

<hr>

**NOTE** - Present `<option>` children, of target `<select>` element, are not included in `data` by default. Hence, options disclusion, unless they are specified directly within this array object.
<hr>

- `onChange`: Callback function when the selected option changes.



Example configuration:
```javascript
new DynamicSelect('#dynamic-select', {
    placeholder: 'Select an option',
    tabindex: 0,
    columns: 2,
    disabled: false,
    // Style however you like
    width: '300px',
    height: '50px',
    class: 'form-control px-0', // for Bootstrap5 library
    selectedStyle: 'border: 0', // for Bootstrap5 library
    dropdownStyle: 'background-color: #E8E8E8',
    // Customize options ( <item> elements of parent <dropdown> )
    data: [
        { value: '1', text: 'Option 1', img: 'path/to/image1.jpg' },
        { value: '2', text: 'Option 2', img: 'path/to/image2.jpg', disabled: true },
        { value: '3', text: 'Option 3', img: 'path/to/image3.jpg', selected: true }
    ],
    onChange: function(value, text, option) {
        console.log(value, text, option);
    }
});
```
**More Advanced Examples** - https://jsfiddle.net/sat6h1r4/


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

David Adams - [info@codeshack.io](mailto:info@codeshack.io)

GitHub: [https://github.com/codeshackio/dynamic-select-images-js](https://github.com/codeshackio/dynamic-select-images-js)

X (Twitter): [https://twitter.com/codeshackio](https://twitter.com/codeshackio)
