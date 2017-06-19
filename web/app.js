const NewFormButton = {
  BUTTON_QUERY: '#new-file',
  LAST_FORM_QUERY: '.code-form--file:last-of-type',

  init() {
    const button = document.querySelector(this.BUTTON_QUERY);
    button.addEventListener('click', () => this.onClick());
  },

  onClick() {
    const lastForm = document.querySelector(this.LAST_FORM_QUERY);
    const newForm = this.getNewForm();
    const formsWrapper = lastForm.parentNode;

    formsWrapper.insertBefore(newForm, lastForm.nextSibling);
  },

  getNewForm() {
    const index = this.getNextIndex();
    const newForm = document.createElement('fieldset');
    newForm.setAttribute('class', 'code-form--file');
    newForm.setAttribute('data-index', index);

    newForm.innerHTML =
      `<label class="code-form--label" for="name[${index}]">Nazwa pliku (opcjonalna)</label>
       <input type="text" id="name[${index}]" name="name[${index}]" class="code-form--control">
       <label for="content[${index}]" class="code-form--label">Treść pliku</label>
       <textarea name="content[${index}]" id="content[${index}]" rows="10" class="code-form--control code-form--control__textarea"></textarea>`;

    return newForm;
  },

  getNextIndex() {
    const currentIndex = parseInt(document.querySelector(this.LAST_FORM_QUERY).getAttribute('data-index'), 10);

    return currentIndex + 1;
  },
};

const DragAndDrop = {
  PLACEHOLDER_QUERY: '.drop-overlay',
  FILE_FORM_QUERY: '.code-form--file',
  ALLOWED_MIME_TYPES: [
    '',
    'text/h323',
    'text/php',
    'text/javascript',
    'application/json',
    'text/x-ruby-script',
    'text/xml',
    'application/internet-property-stream',
    'application/postscript',
    'application/olescript',
    'text/plain',
    'application/x-bcpio',
    'application/octet-stream',
    'text/plain',
    'application/vnd.ms-pkiseccat',
    'application/x-cdf',
    'application/x-x509-ca-cert',
    'application/octet-stream',
    'application/x-msclip',
    'application/x-cpio',
    'application/x-mscardfile',
    'application/pkix-crl',
    'application/x-x509-ca-cert',
    'application/x-csh',
    'text/css',
    'application/x-director',
    'application/x-x509-ca-cert',
    'application/x-director',
    'application/octet-stream',
    'application/msword',
    'application/msword',
    'application/x-dvi',
    'application/x-director',
    'application/postscript',
    'text/x-setext',
    'application/envoy',
    'application/fractals',
    'x-world/x-vrml',
    'text/plain',
    'application/x-hdf',
    'application/winhlp',
    'application/mac-binhex40',
    'application/hta',
    'text/x-component',
    'text/html',
    'text/html',
    'text/webviewhtml',
    'application/x-iphone',
    'application/x-internet-signup',
    'application/x-internet-signup',
    'application/x-javascript',
    'application/x-latex',
    'application/octet-stream',
    'application/octet-stream',
    'application/x-troff-man',
    'application/x-troff-me',
    'message/rfc822',
    'message/rfc822',
    'application/x-msmoney',
    'application/vnd.ms-project',
    'application/x-troff-ms',
    'application/x-msmediaview',
    'message/rfc822',
    'application/oda',
    'application/pkcs10',
    'application/x-pkcs12',
    'application/x-pkcs7-certificates',
    'application/x-pkcs7-mime',
    'application/x-pkcs7-mime',
    'application/x-pkcs7-certreqresp',
    'application/x-pkcs7-signature',
    'application/pdf',
    'application/x-pkcs12',
    'application/ynd.ms-pkipko',
    'application/x-perfmon',
    'application/x-perfmon',
    'application/x-perfmon',
    'application/x-perfmon',
    'application/x-perfmon',
    'application/pics-rules',
    'application/postscript',
    'application/x-mspublisher',
    'application/x-troff',
    'application/rtf',
    'text/richtext',
    'application/x-msschedule',
    'text/scriptlet',
    'application/set-payment-initiation',
    'application/set-registration-initiation',
    'application/x-sh',
    'application/x-shar',
    'application/x-stuffit',
    'application/x-pkcs7-certificates',
    'application/futuresplash',
    'application/x-wais-source',
    'application/vnd.ms-pkicertstore',
    'application/vnd.ms-pkistl',
    'text/html',
    'application/x-sv4cpio',
    'application/x-sv4crc',
    'application/x-troff',
    'application/x-tar',
    'application/x-tcl',
    'application/x-tex',
    'application/x-texinfo',
    'application/x-texinfo',
    'application/x-troff',
    'application/x-msterminal',
    'text/tab-separated-values',
    'text/plain',
    'text/iuls',
    'text/x-vcard',
    'x-world/x-vrml',
    'application/vnd.ms-works',
    'application/vnd.ms-works',
    'application/vnd.ms-works',
    'application/x-msmetafile',
    'application/vnd.ms-works',
    'application/x-mswrite',
    'x-world/x-vrml',
    'x-world/x-vrml',
    'x-world/x-vrml',
    'x-world/x-vrml',
  ],

  init() {
    this.lastTarget = null;
    this.placeholder = document.querySelector(this.PLACEHOLDER_QUERY);

    this.handleDragEnter();
    this.handleDragLeave();
    this.handleDragOver();
    this.handleDrop();
  },

  handleDragEnter() {
    window.addEventListener("dragenter", (event) => {
      if (this.isFile(event)) {
        this.lastTarget = event.target;
        this.showPlaceholder();
      }
    });
  },

  handleDragLeave() {
    window.addEventListener("dragleave", (event) => {
      event.preventDefault();

      if (event.target === this.lastTarget) {
        this.hidePlaceholder();
      }
    });
  },

  handleDragOver() {
    window.addEventListener("dragover", (event) => {
      event.preventDefault();
    });
  },

  handleDrop() {
    window.addEventListener("drop", (event) => {
      event.preventDefault();
      this.hidePlaceholder();

      const files = [...event.dataTransfer.files]
        .filter(file => this.isReadable(file));

      const fieldsetsToCreateNumber = files.length - this.getEmptyFieldsets().length;
      this.createNewFieldsets(fieldsetsToCreateNumber);

      const emptyFieldsets = this.getEmptyFieldsets();
      emptyFieldsets.forEach((fieldset, index) => this.fillFieldset(fieldset, files[index]))
    });
  },

  createNewFieldsets(number) {
    for(let i = 0; i < number; i++) {
      NewFormButton.onClick();
    }
  },

  fillFieldset(fieldset, file) {
    const input = fieldset.querySelector('input');
    const textarea = fieldset.querySelector('textarea');

    input.value = this.getFileName(file);

    this.getFileContent(file).then(content => {
      textarea.value = content;
    });
  },

  getEmptyFieldsets() {
    const fieldsets = [...document.querySelectorAll(this.FILE_FORM_QUERY)];

    return fieldsets.filter(fieldset => this.isFieldsetEmpty(fieldset));
  },

  isFieldsetEmpty(fieldset) {
    const inputValue = fieldset.querySelector('input').value;
    const textareaValue = fieldset.querySelector('textarea').value;

    return inputValue + textareaValue === '';
  },

  isFile(event) {
    return event.dataTransfer.types.some(type => type === 'Files');
  },

  isReadable(file) {
    console.log(file.type, this.ALLOWED_MIME_TYPES.some(type => file.type === type));

    return this.ALLOWED_MIME_TYPES.some(type => file.type === type);
  },

  getFileName(file) {
    return file.name;
  },

  getFileContent(file) {
    return new Promise(resolve => {
      const fileReader = new FileReader();

      fileReader.readAsText(file);
      fileReader.onload = (event) => {
        resolve(event.target.result);
      };
    });
  },

  showPlaceholder() {
    this.placeholder.classList.add('drop-overlay__active');
  },

  hidePlaceholder() {
    this.placeholder.classList.remove('drop-overlay__active');
  },
};

DragAndDrop.init();
NewFormButton.init();
