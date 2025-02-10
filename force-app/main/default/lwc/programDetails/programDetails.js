import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProgramDetails from '@salesforce/apex/ProgramController.getProgramDetails';
import createCertificates from '@salesforce/apex/ProgramController.createCertificates';
import createAssets from '@salesforce/apex/ProgramController.createAssets';
import createOnboardings from '@salesforce/apex/ProgramController.createOnboardings';
import createInterns from '@salesforce/apex/ProgramController.createInterns';

export default class ProgramDetails extends NavigationMixin(LightningElement) {
    @api recordId;

    @track errorMessage = '';
    @track popoverStyle = '';

    @track currentPage = 1;
    @track program = {}; 
    @track intern = {}; 
    @track certificates = [];
    @track onboardings = []; 
    @track onboarding = {}; 
    @track interns = []; 
    @track contacts = []; 
    @track assets = [];
    @track trainings = []; 
    @track users = []; 

    @track _searchKey = '';
    @track searchResults = [this.trainings];
    @track _searchResults = [...this.users, ...this.trainings];
    @track selectedUser = '';
    @track userId = '';

    @track _searchKey = '';
    @track selectedTraining = '';
    @track trainingId = '';

    @track isshow = false;
    @track _isshow = false;
    @track isfocus = false;
    @track _isfocus = false;
    @track showButton = false;

    

    isEditingProgram = false;
    editingRowId = null;
    isEditing = false;
    isLoading = false;
    showProgram = true;
    error;

    isModalProgram = false;
    isModalCertificate = false;
    isModalOnboarding = false;
    isModalIntern = false;
    @track isAssetSelected = false;

    @track selectedInterns = [];
    @track selectedUsers = [];

    @track programtypeOptions = [
        { label: '3 Months', value: '3 Months' },
        { label: '6 Months', value: '6 Months' },
        { label: '12 Months', value: '12 Months' },
    ];

    @track authoritybyOptions = [
        { label: 'Salesforce', value: 'Salesforce' },
        { label: 'Microsoft', value: 'Microsoft' },
        { label: 'Amazon', value: 'Amazon' },
    ];

    @track typeOptions = [
        { label: 'Asset', value: 'Asset' },
        { label: 'Contract', value: 'Contract' },
        { label: 'Education Background', value: 'Education Background' },
    ];

    @track progress = 0;
    @track steps = [
        { id: 1, className: 'slds-progress__item slds-is-active', icon: false },
        { id: 2, className: 'slds-progress__item', icon: false },
        { id: 3, className: 'slds-progress__item', icon: false },
        { id: 4, className: 'slds-progress__item', icon: false },
        { id: 5, className: 'slds-progress__item', icon: false }
    ];

    tempCertificates= [];
    tempOnboarding= {};
    tempAssets= [];
    isCompleted = false;

    // Fetch program details from the Apex controller
    @wire(getProgramDetails, { programId: '$recordId' })
    wiredProgramDetails({ error, data }) {
        if (data) {
            this.program = data.program;
            this.certificates = data.certificates;
            this.onboardings = data.onboardings;
            this.interns = data.interns;
            this.trainings = data.trainings;
            this.users = data.users;
            this.contacts = data.contacts;

            this.checkCompletion();
        } else if (error) {
            this.error = error;
        }
        this.updateCategoryData();
    }

    checkCompletion() {
        this.isCompleted = this.certificates.length > 0 && this.onboardings.length > 0 && this.interns.length > 0;
        if (!this.isCompleted) {
            this.showToast('Incomplete Program', 'Please complete Certificates, Interns, and Onboarding by pressing "New +" button.', 'error');
        }
    }
    

    handleProgressNext() {
        if (this.validateStep()) {
            if (this.progress < 100) {
                this.progress += 25;
                this.currentPage++;
                this.updateStepClasses();
            }
        }else{
            this.errorMessage = 'Please fill in all required fields correctly.';
        }
    }

    handleProgressPrev() {
        if (this.progress > 0) {
            this.progress -= 25;
            this.currentPage--
            this.updateStepClasses();
        }
    }

    get isCertificates() { 
        return this.currentPage === 1; 
    }
    get isInterns() { 
        return this.currentPage === 2; 
    }
    get isOnboardings() { 
        return this.currentPage === 3; 
        }
    get isTraining() { return this.currentPage === 4; }
    get isModules() { return this.currentPage === 5; }

    updateStepClasses() {
        const currentStep = this.progress / 25;
        this.steps.forEach((step, index) => {
            if (index < currentStep) {
                step.className = 'slds-progress__item slds-is-completed';
                step.icon = true;
            } else if (index === currentStep) {
                step.className = 'slds-progress__item slds-is-active';
                step.icon = false;
            } else {
                step.className = 'slds-progress__item';
                step.icon = false;
            }
        });
    }

    get progressStyle() {
        return `width:${this.progress}%`;
    }

    selectedCategory = 'Program';
    dropdownOpen = false;
    categories = [];
    

    updateCategoryData() {
        this.categories = [
            {
                label: 'Certificates',
                value: 'Certificates',
                iconName: 'standard:education',
                hasData: this.program,
            },
            {
                label: 'Interns',
                value: 'Interns',
                iconName: 'standard:customers',
                hasData: this.certificates && this.certificates.length > 0,
            },
            {
                label: 'Onboardings',
                value: 'Onboardings',
                iconName: 'standard:asset_action',
                hasData: this.interns && this.interns.length > 0,
            },
        ];

        // Update class names for each category
        this.categories = this.categories.map((category) => ({
            ...category,
            className:
                category.hasData || category.value === 'Program'
                    ? 'slds-listbox__item'
                    : 'slds-listbox__item disabled',
        }));
    }

    handleCategoryChange(event) {
        const selectedCategory = event.target.closest('li').dataset.value;
        const category = this.categories.find((cat) => cat.value === selectedCategory);

        if (!category || (!category.hasData && category.value !== 'Program')) {
            // Prevent interaction for disabled categories
            event.preventDefault();
            category.hasData = false;
            category.error = true;
            return;
        }

        this.selectedCategory = selectedCategory;
        this.dropdownOpen = false;
    }

    // Toggle dropdown visibility
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    }
  
    // Get the correct class for dropdown visibility
    get dropdownClass() {
      return this.dropdownOpen ? 'slds-popover slds-nubbin_top-left slds-dynamic-menu slds-show' : 'slds-popover slds-nubbin_top-left slds-dynamic-menu slds-hide';
    }
  
    connectedCallback() {
        document.addEventListener('click', this.handleClickOutside);
    }
  
    disconnectedCallback() {
      document.removeEventListener('click', this.handleClickOutside);
    }
  
    handleClickOutside(event) {
      const dropdown = this.template.querySelector('.slds-dropdown');
      if (dropdown && !dropdown.contains(event.target)) {
        this.dropdownOpen = false;
      }
    }

    // Getter for dynamic icon name based on selectedCategory
    get getIconName() {
        const category = this.categories.find(cat => cat.value === this.selectedCategory);
        return category ? category.iconName : 'custom:custom25';
    }

    get isProgramSelected() {
        return this.selectedCategory === 'Program';
      }

    get isCertificatesSelected() {
        return this.selectedCategory === 'Certificates';
    }

    get isOnboardingSelected() {
        return this.selectedCategory === 'Onboardings';
    }

    get isInternsSelected() {
        return this.selectedCategory === 'Interns';
    }

    handleButtonClick() {
        this.tempCertificates= [{ id: Date.now()}];
        this.tempOnboarding= { id: Date.now()};
        this.tempAssets = [{ id: Date.now()}];
        this.isModalProgram = true;

    }

    @track classDisabled;

    get totalItems() {
        switch (this.selectedCategory) {
            case 'Certificates':
                return this.certificates?.length || 0;
            case 'Onboardings':
                return this.onboardings?.length || 0;
            case 'Interns':
                return this.interns?.length || 0;
            default:
                return 0;
        }
    }
    handleRowCertificate(event) {
        const rowId = event.currentTarget.dataset.row;
    
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: rowId,
                objectApiName: 'Certificate__c', 
                actionName: 'view'
            }
        });
    }

    handleRowOnboarding(event) {
        const rowId = event.currentTarget.dataset.row;
    
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: rowId,
                objectApiName: 'Onboarding__c', 
                actionName: 'view'
            }
        });
    }

    handleRowIntern(event) {
        const rowId = event.currentTarget.dataset.row;
    
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: rowId,
                objectApiName: 'Intern__c', 
                actionName: 'view'
            }
        });
    }

    _editingStop() {
        this.certificates = this.certificates.map((certificate) => {
            return { ...certificate, isSelected: false };
        });

        this.assets = this.assets.map((asset) => {
            return { ...asset, isSelected: false };
        });
        

        this.interns = this.interns.map((intern) => {
            return { ...intern, isSelected: false };
        });
        this.isEditing = false;
        this.showProgram = true;
    }

    validateStep() {
        let isValid = true;
        const inputs = this.template.querySelectorAll('lightning-input, lightning-combobox');
    
        inputs.forEach(input => {
            // Validate combobox fields
            if (input.tagName === 'LIGHTNING-COMBOBOX' && !input.value) {
                input.setCustomValidity('This field is required.');
                isValid = false;
            } else {
                input.setCustomValidity('');
            }
    
            if(this.currentPage === 2){
                
                if (!this.userId) {
                    input.setCustomValidity('This field is required.');
                    isValid = false;
                }
            }
            if (!input.checkValidity()) {
                isValid = false;
            }
    
            input.reportValidity();
        });
    
        return isValid;
    }
    
    certificateChanges(event) {
        const field = event.target.name;
        const index = event.target.dataset.index;
        const rowId = event.target.dataset.id;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;


        this.tempCertificates[index] = {
            ...this.tempCertificates[index],
            [field]: value,
        };

        // Update program fields if the program exists
        if (this.program && this.program.Id === rowId) {
            this.program = { ...this.program, [field]: value };
        }
        localStorage.setItem('certificates', JSON.stringify(this.tempCertificates));

    }

    OnboardingChanges(event) {
        const field = event.target.name;
        const index = event.target.dataset.index;
        const rowId = event.target.dataset.id;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    
        // Handle onboarding separately
        if (this.tempOnboarding && this.tempOnboarding.Id === rowId) {
            this.tempOnboarding = { ...this.tempOnboarding, [field]: value };
            localStorage.setItem('onboarding', JSON.stringify(this.tempOnboarding));
        }
    
        // Handle Type__c logic
        if (field === 'Type__c') {
            this.isAssetSelected = value === 'Asset';
        }
    }

    AssetChanges(event) {
        const field = event.target.name;
        const index = event.target.dataset.index;
        const rowId = event.target.dataset.id;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    
        // Ensure tempAssets exists
        if (this.tempAssets && this.tempAssets[index]) {
            this.tempAssets[index] = {
                ...this.tempAssets[index],
                [field]: value,
            };
    
            // Store updated tempAssets in localStorage
            localStorage.setItem('assets', JSON.stringify(this.tempAssets));
        }
    }

    // Add a new certificate row dynamically
    addCertificate() {
        const newCertificate = { 
            id: Date.now(), 
            certName: '', 
            Authority_By__c: '' 
        };
        this.tempCertificates = [...this.tempCertificates, newCertificate];

    }

    addAsset() {
        const newAsset = {
            id: Date.now(),
            assetName: '',
            Serial_Number__c: '',
            Status__c: '',
            Contact__c: '',
            Assigned_Date__c: ''
        };
    
        this.tempAssets = [...this.tempAssets, newAsset];
        localStorage.setItem('assets', JSON.stringify(this.tempAssets));
    }

    // Delete a row based on the ID
    deleteRow(event) {
        const rowId = Number(event.target.dataset.id); // Use Number() to handle better conversion

    
        // Prevent deletion if only one item remains in either collection
        if (this.tempCertificates.length === 1 && this.tempAssets.length === 1) {
            this.errorMessage = 'Cannot delete the last remaining row from all collections.';
            return;
        }
    
        // Remove the row from each collection where the ID matches
        this.tempCertificates = this.tempCertificates.filter(cert => cert.id !== rowId);
        this.tempAssets = this.tempAssets.filter(asset => asset.id !== rowId);
    
        // Clear error message if deletion was successful
        this.errorMessage = '';
    }
    
    

    handleSubmit() {
        this.errorMessage = '';
        this.isLoading = true;
    
        // Retrieve data from localStorage
        const certificates = JSON.parse(localStorage.getItem('certificates')) || [];
        const assets = JSON.parse(localStorage.getItem('assets')) || [];
        const onboarding = JSON.parse(localStorage.getItem('onboarding')) || [];
        const selectedUsers = JSON.parse(localStorage.getItem('selectedUsers')) || [];

        // Prepare data for API calls
        const assignedTo = selectedUsers.map(user => user.Id);
    
        const certificatesData = certificates.map(cert => ({
            Id: cert.Id || null,
            certName: cert.certName,
            Authority_By__c: cert.Authority_By__c,
        }));
    
        const onboardingData = {
            Id: onboarding.Id || null,
            onboardName: onboarding.onboardName,
            Type__c: onboarding.Type__c,
        };
    
        const assetsData = assets.map(asset => ({
            Id: asset.Id || null,
            assetName: onboarding.onboardName,
            Assigned_Date__c: asset.Assigned_Date__c,
            Condition_Before__c: asset.Condition_Before__c,
            Contact__c: asset.Contact__c,
            Serial_Number__c: asset.Serial_Number__c,
            Status__c: asset.Status__c,
        }));
    
        if (!this.validateStep()) {
            this.isLoading = false;
            return;
        }
    
    
        // Execute API calls sequentially to prevent partial saving
        createCertificates({ certificates: certificatesData, programId: this.recordId })
            .then(() => createInterns({ assignedTo, programId: this.recordId }))
            .then(() => createOnboardings({ onboarding: onboardingData, assignedTo, programId: this.recordId }))
            .then(() => createAssets({ assets: assetsData}))
            .then(() => {
                this.showToast('Success', 'All data saved successfully!', 'success');
                this.refreshPage();
                this.closeModel();
                this._editingStop();
    
                // Clear localStorage after successful save
                localStorage.clear();
            })
            .catch(error => {
                this.errorMessage = error.body.message || 'An unexpected error occurred.';
            })
            .finally(() => {
                this.isLoading = false;
            });
    }
    

    _handleSearch(event) {
        this._searchKey = event.target.value.toLowerCase();
        if (this._searchKey) {
            this._searchResults = this.users.filter(user => {
                const nameMatches = user.Id && user.Name.toLowerCase().includes(this._searchKey );
    
                return nameMatches;
            });
    
        } else {
            this._searchResults = [];
            this._isfocus = false;
        }
    }

    _handleInputFocus() {
        this._searchResults = [...this.users];
        this._isfocus = true;
    }

    _selectUser(event) {
        this.userId = event.target.closest('li').dataset.id;
        const selectedUser = this.users.find(user => user.Id === this.userId);
    
        if (selectedUser && !this.selectedUsers.some(user => user.Id === this.userId)) {
            this.selectedUsers = [...this.selectedUsers, selectedUser];
    
            localStorage.setItem('selectedUsers', JSON.stringify(this.selectedUsers));
        }
    
        this._searchKey = '';
        this._searchResults = [];
        this._isshow = true;
        this._isfocus = false;
    }
    

    _removeSelected(event) {
        this.userId = event.target.closest('button').dataset.id;
        if(this.selectedUsers = this.selectedUsers.filter(user => user.Id !== this.userId)){
            this._isshow = false;
            this._isfocus = false;
        }
    }

    @track searchAccount = '';
    @track contactResults = [];
    @track contactId = '';
    @track selectedContact = '';

    handleAccount(event) {
        const index = event.target.closest('li').dataset.index; // Get row index
        this.searchAccount[index] = event.target.value.toLowerCase();
        if (this.searchAccount) {
            this.contactResults = this.contacts.filter(contact => {
                const nameMatches = contact.Id && contact.Name.toLowerCase().includes(this.searchAccount[index]);
    
                return nameMatches;
            });
        } else {
            this.contactResults = [];
            this.isfocus = false;
        }
    }


    handleContactFocus() {
        this.contactResults = [...this.contacts];
        this.isfocus = true;
    }

    selectContact(event) {
        const index = event.target.closest('li').dataset.index; // Get row index
        const contactId = event.target.closest('li').dataset.id;
        const selectedContact = this.contacts.find(contact => contact.Id === contactId);
    
        if (selectedContact) {
            this.tempAssets = this.tempAssets.map((asset, i) => 
                i == index 
                    ? { ...asset, Contact__c: selectedContact.Id }
                    : asset
            );
    
            localStorage.setItem('assets', JSON.stringify(this.tempAssets));
        }
    
        this.searchAccount = '';
        this.contactResults = [];
        this.isshow = true;
        this.isfocus = false;
    }
    
    removeContact(event) {
        const button = event.target.closest('button');
        const contactId = button ? button.dataset.id : null;

        if (contactId && this.selectedContact && this.selectedContact.Id === contactId) {
            this.selectedContact= null;
            this.isshow = false;
            this.isFocus = false;
        } 
    }
    
    handingClose() {
        this._editingStop();
        this.isCompleted;
    }

    closeModel() {
        this.tempCertificates= [];
        this.tempOnboarding = {};
        this.tempInterns = [];
        this._editingStop();
        this.isModalCertificate = false;
        this.isModalOnboarding = false;
        this.isModalIntern = false;
        this.isModalProgram = false;
    }

    closePopOver(){
        this.errorMessage = null;
    }
    refreshPage() {
        // Reloads the current page by navigating to it again
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,   // Record ID of the current page
                objectApiName: 'Program__c',  // Object name of the current record
                actionName: 'view'         // Action to perform (view)
            }
        });
    }

    // Display a toast message for success or error
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(event);
    }
}
