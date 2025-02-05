import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProgramDetails from '@salesforce/apex/ProgramController.getProgramDetails';
import createCertificates from '@salesforce/apex/ProgramController.createCertificates';
import updateProgram from '@salesforce/apex/ProgramController.updateProgram';
import createAssets from '@salesforce/apex/ProgramController.createAssets';
import createOnboardings from '@salesforce/apex/ProgramController.createOnboardings';
import createInterns from '@salesforce/apex/ProgramController.createInterns';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';

export default class ProgramDetails extends NavigationMixin(LightningElement) {
    @api recordId;

    @track errorMessage = '';
    @track currentPage = 1;
    @track program = {}; 
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

    @track programtypeOptions = [
        { label: '3 Months', value: '3 Months' },
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
    tempOnboarding = {};
    tempAssets = [];
    tempInterns = [];

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

        } else if (error) {
            this.error = error;
        }
        this.updateCategoryData();
    }

    handleProgressNext() {
        if (this.validateStep()) {
            if (this.progress < 100) {
                this.progress += 25;
                this.currentPage++;
                this.updateStepClasses();
            }
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
  
    // Close dropdown if clicking outside
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
        if (this.selectedCategory === 'Program' || this.currentPage === 1) {
            this.tempCertificates= [{ id: Date.now()}];
            this.isModalProgram = true;
        } 
        else if (this.selectedCategory === 'Certificates' || this.currentPage === 2) {
            this.tempCertificates= [{ id: Date.now()}];
            this.isModalCertificate = true;
        } 
        else if(this.selectedCategory === 'Onboardings' || this.currentPage === 3){
            this.tempAssets = [{ id: Date.now()}];
            this.isModalOnboarding = true;
        }
        else if(this.selectedCategory === 'Interns' || this.currentPage === 4){
            this.tempInterns = [{ id: Date.now()}];
            this.isModalIntern = true;
        }
        else {
            this.showButton = false; 
        }
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

    // Toggle edit mode for Program, Certificate, Onboarding
    _editProgram() {
        this.isEditingProgram = true;
        this.isEditing = true;
    }

    _editingButton(event) {
        const rowId = event.currentTarget.dataset.row;

        this.certificates = this.certificates.map(certificate => {
            return {
                ...certificate,
                isSelected: certificate.Id === rowId
            };
        })
        this.onboardings = this.onboardings.map(onboarding => {
            return {
                ...onboarding,
                isSelected: onboarding.Id === rowId,
                selectedUser: onboarding.Id === rowId,
            };
        });
        this.interns = this.interns.map(intern => {
            return {
                ...intern,
                
                isSelected: intern.Id === rowId,
                selectedUser: intern.Id === rowId,
                selectedTraining: intern.Id === rowId
            };
        })
        this.isEditing = true;
        this.showProgram = false;

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

    // Method to validate inputs on the current step
    validateStep() {
        let isValid = true;
        const inputs = this.template.querySelectorAll('lightning-input');

        // Validate all inputs on the current step before moving to the next one
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                isValid = false;
                input.reportValidity(); // Shows validation error if invalid
            }
        });

        return isValid;
    }

    handleObjectChanges(event) {
        const field = event.target.name;
        const index = event.target.dataset.index;
        const rowId = event.target.dataset.id;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

        // Helper function to update an array by index and rowId
        // const updateArray = (array, tempArray, key) => {
        //     tempArray[index] = {
        //         ...tempArray[index],
        //         [field]: value,
        //     };

        //     const updatedArray = array.map((item) => {
        //         if (item.Id === rowId) {
        //             return { ...item, [field]: value };
        //         }
        //         return item;
        //     });

        //     // Save the updated array to sessionStorage
        //     sessionStorage.setItem(key, JSON.stringify(updatedArray));

        //     return updatedArray;
        // };

        this.tempCertificates[index] = {
            ...this.tempCertificates[index],
            [field]: value,
        };

        this.tempInterns[index] = {
            ...this.tempInterns[index],
            [field]: value,
        };

        // Update program fields if the program exists
        if (this.program && this.program.Id === rowId) {
            this.program = { ...this.program, [field]: value };
        }

        localStorage.setItem('certificates', JSON.stringify(this.tempCertificates));
        // localStorage.setItem('assets', JSON.stringify(this.assets));
        localStorage.setItem('interns', JSON.stringify(this.tempInterns));

        // Handle onboarding separately
        if (this.onboarding && this.onboarding.Id === rowId) {
            this.onboarding = { ...this.onboarding, [field]: value };
            // sessionStorage.setItem('onboarding', JSON.stringify(this.onboarding));
        }

        // Check if the field is Type__c and handle the isAssetSelected logic
        if (field === 'Type__c') {
            this.isAssetSelected = value === 'Asset';
        }
    }

    

    // Add a new certificate row dynamically
    addCertificate() {
        const newCertificate = { 
            id: Date.now(), 
            Name: '', 
            Authority_By__c: '' 
        };
        this.tempCertificates = [...this.tempCertificates, newCertificate];

    }

    addAsset() {
        const newAsset = {
            id: Date.now(),
            Name: '',
            Serial_Number__c: '',
            Status__c: '',
            Assigned_Date__c: ''
    
        };
    
        this.tempAssets = [...this.tempAssets, newAsset];
    }

    // Add a new intern row dynamically
    addIntern() {
        const newRow = { 
            id: Date.now(), 
            User__c: '', 
            // Training_Program__c: '' 
        };
        this.tempInterns = [...this.tempInterns, newRow];
    }

    // Delete a row based on the ID
    deleteRow(event) {
        const rowId = parseInt(event.target.dataset.id);
        console.error('Row ID to delete:', rowId);
    
        // Prevent deletion if only one item exists in all collections
        if (
            this.tempCertificates.length === 1 ||
            this.tempAssets.length === 1 ||
            this.tempInterns.length === 1
        ) {
            this.showToast('Error', 'Cannot delete the last remaining row from all collections.', 'error');
            return;
        }
    
        // Remove the row from each collection where the ID matches
        this.tempCertificates = this.tempCertificates.filter(cert => cert.id !== rowId);
        this.tempInterns = this.tempInterns.filter(intern => intern.id !== rowId);
        this.tempAssets = this.tempAssets.filter(asset => asset.id !== rowId);
    }
    

    @track selectedInterns = [];
    @track assignedToId = '';

    handleIntern(event) {
        this.internKey = event.target.value.toLowerCase();
        if (this.internKey) {
            this.internResults = this.program.Interns__r.filter(intern => {
                // Check if intern.User__r and Name are defined and contain searchKey
                const nameMatches = intern.Name && 
                intern.User__r.Name.toLowerCase().includes(this.internKey );
    
                return nameMatches;
            });
    
        } else {
            this.internResults = [];;
        }
    }

    handleInternFocus() {
        this.internResults = [...this.program.Interns__r];
        this.isfocus = true;
    }

    selectIntern(event) {
        this.assignedToId = event.target.closest('li').dataset.id;
       const selectedIntern = this.program.Interns__r.find(intern => intern.User__c === this.assignedToId);


       if (selectedIntern && !this.selectedInterns.some(intern => intern.User__c === this.assignedToId)) {
           this.selectedInterns = [...this.selectedInterns, selectedIntern];
       }

       this.internKey = '';
       this.internResults = [];
       this.isfocus = false;
   }

   removeSelectedIntern(event) {
       this.assignedToId = event.target.closest('button').dataset.id;
       this.selectedInterns = this.selectedInterns.filter(intern => intern.User__c !== this.assignedToId);
   }

    handleSubmit() {
        this.errorMessage = '';
        this.isLoading = true;

        // Prepare data for each category
        this.certificates = [...this.certificates, ...this.tempCertificates];
        this.assets = [...this.assets, ...this.tempAssets];
        this.interns = [...this.interns, ...this.tempInterns];

        const assignedTo = this.selectedInterns.map(intern => intern.User__c);

        const programData = {
            Name: this.program.Name,
            Program_Type__c: this.program.Program_Type__c,
            Department__c: this.program.Department__c,
            Start_Date__c: this.program.Start_Date__c,
            End_Date__c: this.program.End_Date__c
        };

        const certificatesData = this.certificates.map(cert => ({
            Id: cert.Id || null,
            Name: cert.Name,
            Authority_By__c: cert.Authority_By__c,
        }));

        // Format the onboardings
        const onboardingData = {
            Id: this.onboarding.Id || null,
            Name: this.onboarding.Name,
            Type__c: this.onboarding.Type__c,
        };

        // Format the assets
        const assetsData = this.assets.map(asset => ({
            Id: asset.Id || null,
            Name: asset.Name,
            Assigned_Date__c: asset.Assigned_Date__c,
            Condition_After__c: asset.Condition_After__c,
            Condition_Before__c: asset.Condition_Before__c,
            Contact__c: asset.Contact__c || this.selectContact.Id,
            Returned_Date__c: asset.Returned_Date__c,
            Serial_Number__c: asset.Serial_Number__c,
            Status__c: asset.Status__c,
        }));

        // Format the interns
        const internsData = this.interns.map(intern => ({
            Id: intern.Id || null,
            User__c: intern.User__c || this.selectedUser.Id,
            // Training_Program__c: intern.Training_Program__c || this.selectedTraining.Id,
        }));

        // Handle Program Update
        updateProgram({ program: programData })
            .then(() => {
                this.showToast('Success', 'Program updated successfully!', 'success');
                this.refreshPage();
                this.closeModel();
                this._editingStop();
                this.isLoading = false;
            })
            .catch((error) => {
                if (error.body && error.body.message) {
                    this.errorMessage = error.body.message;
                } else {
                    this.errorMessage = 'An unexpected error occurred.';
                }
            });


        if (this.validateStep()) {
            // Handle Certificates
            if (this.currentStep === 1) {
                createCertificates({ certificates: certificatesData, programId: this.recordId })
                .then(() => {
                    this.refreshPage();
                    this.showToast('Success', 'Certificates created/updated successfully!', 'success');
                    this.closeModel();
                    this._editingStop();
                    this.isLoading = false;
                })
                .catch((error) => {
                    if (error.body && error.body.message) {
                        this.errorMessage = error.body.message;
                    } else {
                        this.errorMessage = 'An unexpected error occurred.';
                    }
                });
            }
            
            // Handle Onboardings and Assets
            else if (this.currentStep === 2) {
                createOnboardings({ onboarding: onboardingData, assignedTo, programId: this.recordId })
                .then(() => {
                    return createAssets({ assets: assetsData, onboardingId: this.onboarding.Id });
                })
                .then(() => {
                    this.refreshPage();
                    this.showToast('Success', 'Onboardings and assets created/updated successfully!', 'success');
                    this.closeModel();
                    this._editingStop();
                    this.isLoading = false;
                })
                .catch((error) => {
                if (error.body && error.body.message) {
                        this.errorMessage = error.body.message;
                    } else {
                        this.errorMessage = 'An unexpected error occurred.';
                    }
                });
            }
            // Handle Interns
            else if (this.currentStep === 3) {
                createInterns({ interns: internsData, programId: this.recordId })
                .then(() => {
                    this.refreshPage();
                    this.showToast('Success', 'Interns created/updated successfully!', 'success');
                    this.closeModel();
                    this._editingStop();
                    this.isLoading = false;
                })
                .catch((error) => {
                if (error.body && error.body.message) {
                        this.errorMessage = error.body.message;
                    } else {
                        this.errorMessage = 'An unexpected error occurred.';
                    }
                });
            }
            // Default case
            else {
                this.isLoading = false;
                return 0;
            }
        }
        
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

    selectUser(event) {
        this.userId = event.target.closest('li').dataset.id;
        const selectedUser = this.users.find(user => user.Id === this.userId);

    
        if (selectedUser) {
            this.selectedUser = selectedUser;
        }

       this._searchKey = '';
       this._searchResults = [];
       this._isshow = true;
       this._isfocus = false;
   }

    _removeSelected(event) {
        const button = event.target.closest('button');
        const userId = button ? button.dataset.id : null;

        if (userId && this.selectedUser && this.selectedUser.Id === userId) {
            this.selectedUser = null;
            this.interns = [];
            this.trainings = [];
            this._isshow = false;
        } 
    }

    handleSearch(event) {
        this.searchKey = event.target.value.toLowerCase();
        if (this.searchKey) {
            this.searchResults = this.trainings.filter(training => {
                const nameMatches = training.Id && training.Name.toLowerCase().includes(this.searchKey );
    
                return nameMatches;
            });
    
        } else {
            this.searchResults = [];
            this.isfocus = false;
        }
    }


    handleInputFocus() {
        this.searchResults = [...this.trainings];
        this.isfocus = true;
    }

    selectTraining(event) {
        this.trainingId = event.target.closest('li').dataset.id;
        const selectedTraining = this.trainings.find(training => training.Id === this.trainingId);
    
        if (selectedTraining) {
            this.selectedTraining = selectedTraining;
        }

       this.searchKey = '';
       this.searchResults = [];
       this.isshow = true;
       this.isfocus = false;
   }

    removeSelected(event) {
        const button = event.target.closest('button');
        const trainingId = button ? button.dataset.id : null;

        if (trainingId && this.selectedTraining && this.selectedTraining.Id === trainingId) {
            this.selectedTraining = null;
            this.isshow = false;
            this.isFocus = false;
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
                const nameMatches = contact.Id && contact.Name.toLowerCase().includes(this.searchAccount );
    
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
        this.contactId = event.target.closest('li').dataset.id;
        const selectedContact = this.contacts.find(contact => contact.Id === this.contactId);
    
        if (selectedContact) {
            this.selectedContact = selectedContact;
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
