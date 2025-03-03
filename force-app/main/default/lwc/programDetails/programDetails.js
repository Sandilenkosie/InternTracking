import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProgramDetails from '@salesforce/apex/ProgramController.getProgramDetails';
import createCertificates from '@salesforce/apex/ProgramController.createCertificates';
import createModules from '@salesforce/apex/ProgramController.createModules';
import createInterns from '@salesforce/apex/ProgramController.createInterns';

import getOnboardingRecordType from '@salesforce/apex/ProgramController.getOnboardingRecordType';
import { createRecord } from 'lightning/uiRecordApi';
import ONBOARDING_OBJECT from '@salesforce/schema/Onboarding__c';

export default class ProgramDetails extends NavigationMixin(LightningElement) {
    @api recordId;
    @track recordTypeId;

    @track errorMessage = '';
    @track popoverStyle = '';

    @track rowData = [];

    @track currentPage = 1;
    @track program = {}; 
    @track intern = {}; 
    @track modules = []; 
    @track certificates = [];
    @track onboardings = []; 
    @track onboarding = {}; 
    @track interns = []; 
    @track contacts = []; 
    @track assets = [];
    @track trainings = []; 
    @track users = []; 

    @track _searchKey = '';
    @track _searchResults = [];
    @track selectedUser = '';
    @track userId = '';

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
    // InputShow
    @track isAssetSelected = false;
    @track isContractSelected = false;
    @track isEducationSelected = false;

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
        // { label: 'Education Background', value: 'Education Background' },
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
    tempModules= [];
    tempOnboarding= {};
    tempAssets= [];
    isCompleted = false;

    // Fetch program details from the Apex controller
    @wire(getProgramDetails, { programId: '$recordId' })
    wiredProgramDetails({ error, data }) {
        if (data) {
            this.program = data.program;
            this.certificates = data.certificates
            this.onboardings = data.onboardings;
            this.interns = data.interns;
            this.trainings = data.trainings;
            this.users = data.users;
            this.contacts = data.contacts;

            let modules = [];
            this.certificates.forEach(cert => {
                if (cert.Modules__r) {
                    modules = [...modules, ...cert.Modules__r]; 
                }
            });
            this.modules = modules;
            console.log(JSON.stringify(this.modules))

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
    get isModules() { 
        return this.currentPage === 2; 
    }
    get isInterns() { 
        return this.currentPage === 3; 
        }
    get isOnboardings() { 
        return this.currentPage === 4; 
    }
    get isReview() { 
        return this.currentPage === 5; 
    }

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
                label: 'Modules',
                value: 'Modules',
                iconName: 'standard:books',
                hasData: this.certificates && this.certificates.length > 0,
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

        if (!this.tempModules || this.tempModules.length === 0) {
            this.addModule();
        }

        if (!this.tempCertificates || this.tempCertificates.length === 0) {
            this.addCertificate();
        }
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
    get isModulesSelected() {
        return this.selectedCategory === 'Modules';
    }

    get isOnboardingSelected() {
        return this.selectedCategory === 'Onboardings';
    }

    get isInternsSelected() {
        return this.selectedCategory === 'Interns';
    }

    handleButtonClick() {
        this.isModalProgram = true;
    }

    @track classDisabled;

    get totalItems() {
        switch (this.selectedCategory) {
            case 'Certificates':
                return this.certificates?.length || 0;
            case 'Modules':
                return this.modules?.length || 0;
            case 'Onboardings':
                return this.onboardings?.length || 0;
            case 'Interns':
                return this.interns?.length || 0;
            default:
                return 0;
        }
    }

    editProgram(){
        this.isEditingProgram = true;
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

    handleRowModule(event) {
        const rowId = event.currentTarget.dataset.row;
    
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: rowId,
                objectApiName: 'Module__c', 
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

    // _editingStop() {
    //     this.certificates = this.certificates.map((certificate) => {
    //         return { ...certificate, isSelected: false };
    //     });

    //     this.assets = this.assets.map((asset) => {
    //         return { ...asset, isSelected: false };
    //     });
        

    //     this.interns = this.interns.map((intern) => {
    //         return { ...intern, isSelected: false };
    //     });
    //     this.isEditing = false;
    //     this.showProgram = true;
    // }

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
    
            if(this.currentPage === 3){
                
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
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;


        this.tempCertificates[index] = {
            ...this.tempCertificates[index],
            [field]: value,
        };

        localStorage.setItem('certificates', JSON.stringify(this.tempCertificates));

    }

    moduleChanges(event) {
        const field = event.target.name;
        const rowId = event.target.dataset.row;
    
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    
        // Update rowData safely
        const rowIndex = this.rowData.findIndex(row => row.id === parseInt(rowId));
        if (rowIndex !== -1) {
            this.tempModules[rowIndex] = {
                ...this.tempModules[rowIndex],
                [field]: value,
            };
        }
    
        // Save updated modules to localStorage
        localStorage.setItem('modules', JSON.stringify(this.tempModules));
    }
    

    OnboardingChanges(event) {
        const field = event.target.name;
        const rowId = event.target.dataset.id;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    
        // Handle onboarding separately
        if (this.tempOnboarding && this.tempOnboarding.Id === rowId) {
            this.tempOnboarding = { ...this.tempOnboarding, [field]: value };
            localStorage.setItem('onboarding', JSON.stringify(this.tempOnboarding));
        }
    
        // Simplified Type__c logic
        if (field === 'Type__c') {
            this.isAssetSelected = value === 'Asset';
            this.isContractSelected = value === 'Contract';
    
            const recordTypeMap = {
                'Asset': 'Asset Records',
                'Contract': 'Contract Records'
            };
    
            const recordTypeName = recordTypeMap[value];
    
            if (recordTypeName) {
                getOnboardingRecordType({ recordTypeName })
                    .then(result => {
                        this.recordTypeId = result;
                    })
                    .catch(error => console.error("Error fetching Record Type:", error));
            } else {
                this.recordTypeId = null;  // Clear if no match
            }
        }
    }
    
    

    // Add a new Module row dynamically
    addModule() {
        const newModule = { 
            id: Date.now(), 
            moduleName: '', 
            certName: '', 
            Certificate__c: '',
        };

        this.tempModules = [...this.tempModules, newModule];

        const newRowData = {
            id: newModule.id,
            searchKey: '',
            searchResults: [],
            selectedCertificate: null,
            isFocus: false,
            isShow: false,
        };

        this.rowData = [...this.rowData, newRowData];
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

    // Delete a row based on the ID
    deleteRow(event) {
        const rowId = Number(event.target.dataset.id); // Use Number() to handle better conversion

    
        // Prevent deletion if only one item remains in either collection
        if (this.tempCertificates.length === 1 && this.tempModules.length === 1) {
            this.errorMessage = 'Cannot delete the last remaining row from all collections.';
            return;
        }
    
        // Remove the row from each collection where the ID matches
        this.tempCertificates = this.tempCertificates.filter(cert => cert.id !== rowId);
        this.tempModules = this.tempModules.filter(module => module.id !== rowId);
    
        // Clear error message if deletion was successful
        this.errorMessage = '';
    }

    handleSubmit() {
        this.errorMessage = '';
        this.isLoading = true;

        const certificates = JSON.parse(localStorage.getItem('certificates')) || [];
        const modules = JSON.parse(localStorage.getItem('modules')) || [];
        const onboarding = JSON.parse(localStorage.getItem('onboarding')) || [];
        const selectedUsers = JSON.parse(localStorage.getItem('selectedUsers')) || [];
        // Prepare data for API calls
        const assignedTo = selectedUsers.map(user => ({
            Id: user.Id,
            Name: user.Name,
        }));
    
        const certificatesData = certificates.map(cert => ({
            Id: cert.Id || null,
            certName: cert.certName,
            Authority_By__c: cert.Authority_By__c,
        }));
    
        const onboardingData = {
            Name: onboarding.onboardName,
            Assigned_To__c: Array.isArray(assignedTo) && assignedTo.length > 0 
                            ? assignedTo[0].Id
                            : null,
        
            Type__c: onboarding.Type__c,
            Assigned_Date__c: new Date().toISOString().split('T')[0],
            Returned_Date__c: onboarding.Returned_Date__c,
            Condition_Before__c: onboarding.Condition_Before__c,
            Condition_After__c: onboarding.Condition_After__c,
            Contact__c: onboarding.Contact__c,
            Serial_Number__c: onboarding.Serial_Number__c,
            Status__c: onboarding.Status__c,
            Special_Terms__c: onboarding.Special_Terms__c,
            // Status__c: '--None--',
            Description__c: onboarding.Description__c,
            Program__c: this.recordId,
            RecordTypeId: this.recordTypeId
        };
        

        const recordInput = {
            apiName: ONBOARDING_OBJECT.objectApiName,
            fields: onboardingData,
        };
    
        if (!this.validateStep()) {
            this.isLoading = false;
            return;
        }
    
        // Execute API calls sequentially to prevent partial saving
        createCertificates({ certificates: certificatesData, programId: this.recordId })
        .then((createdCertificates) => {
            if (createdCertificates && Array.isArray(createdCertificates)) {
                const modulesData = modules.map(module => {
                    const matchingCertificate = createdCertificates.find(cert => cert.Name === module.certName);
                    return {
                        ...module,
                        moduleName: module.moduleName,
                        Certificate__c: matchingCertificate ? matchingCertificate.Id : null,
                    };
                });
                return createModules({ modules: modulesData,assignedTo, programId: this.recordId });
            } else {
                this.errorMessage = ('No certificates created');
            }
        })
        .then(() => createInterns({ assignedTo, programId: this.recordId }))
        .then(() => createRecord(recordInput))
        .then(() => {
            this.showToast('Success', 'All data saved successfully!', 'success');
            location.reload();
            this.dispatchEvent(new CustomEvent('success', { detail: 'All data saved successfully!' }));
            this.refreshPage();
            this.closeModel();

            localStorage.clear();
        })
        .catch(error => {
            this.errorMessage = error.body?.message || 'An unexpected error occurred.';
            console.error("Error:", error);
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

    handleSearch(event) {
        const rowId = event.target.dataset.row;
        const searchKey = event.target.value.toLowerCase();
    
        // Update the searchKey for the specific row
        const rowIndex = this.rowData.findIndex(row => row.id === parseInt(rowId));

        if (rowIndex !== -1) {
            this.rowData[rowIndex].searchKey = searchKey;
        }
    
        // Filter certificates based on the search key for the row
        if (searchKey) {
            this.rowData[rowIndex].searchResults = this.tempCertificates.filter(certificate =>
                certificate.certName.toLowerCase().includes(searchKey)
            );
            console.log(JSON.stringify(this.rowData[rowIndex].searchResults));
        } else {
            this.rowData[rowIndex].searchResults = [];
            this.rowData[rowIndex].isFocus = false;
            this.rowData[rowIndex].isShow = false; 
        }
    }
    
    // Focus handler for individual rows
    handleInputFocus(event) {
        const rowId = event.target.dataset.row;
        const rowIndex = this.rowData.findIndex(row => row.id === parseInt(rowId));
        if (rowIndex !== -1) {
            this.rowData[rowIndex].searchResults = [...this.tempCertificates]
        }
        this.rowData[rowIndex].isFocus = true;

    }
    
    selectCertificate(event) {
        const rowId = event.target.closest('li').dataset.row;
        const certificateId = event.target.closest('li').dataset.id;
    
        const selectedCertificate = this.tempCertificates.find(cert => cert.id.toString() === certificateId);
        const rowIndex = this.rowData.findIndex(row => row.id === parseInt(rowId));
    
        if (rowIndex !== -1 && selectedCertificate) {
            this.rowData[rowIndex].selectedCertificate = selectedCertificate;
            this.tempModules[rowIndex].certName = selectedCertificate.certName;

            localStorage.setItem('modules', JSON.stringify(this.tempModules));

        }
        // Clear search input for the row
        this.rowData[rowIndex].searchKey = '';
        this.rowData[rowIndex].searchResults = [];
        this.rowData[rowIndex].isFocus = false;
        this.rowData[rowIndex].isShow = true;
    }

    removeselected(event) {
        const button = event.target.closest('button');
        const certificateId = button ? button.dataset.id : null;
        

        if (certificateId && this.selectedCertificate && this.selectedCertificate.id === certificateId) {
            this.selectedCertificate = null;
            this.isshow = false;
            this.isfocus = false;
        } 
    }

    @track searchAccount = '';
    @track contactResults = [];
    @track contactId = '';
    @track selectedContact = '';

    handleAccount(event) {
        this.searchAccount = event.target.value.toLowerCase();
        if (this.searchAccount) {
            this.contactResults = this.contacts.filter(contact => {
                const nameMatches = contact.Id && contact.Name.toLowerCase().includes(this.searchAccount);
    
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
        const contactId = event.target.closest('li').dataset.id;
        const selectedContact = this.contacts.find(contact => contact.Id === contactId);
        console.log(selectedContact.Name);
    
        if (selectedContact) {
            this.selectedContact = selectedContact;
            this.tempOnboarding.Contact__c = selectedContact.Id;
    
            localStorage.setItem('onboarding', JSON.stringify(this.tempOnboarding));
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
        this.isEditingProgram = false;
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
