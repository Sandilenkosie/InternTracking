import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProgramDetails from '@salesforce/apex/ProgramController.getProgramDetails';
import createCertificates from '@salesforce/apex/ProgramController.createCertificates';
import createAssets from '@salesforce/apex/ProgramController.createAssets';
import createOnboardings from '@salesforce/apex/ProgramController.createOnboardings';
import createInterns from '@salesforce/apex/ProgramController.createInterns';


export default class ProgramDetails extends LightningElement {
    @api recordId;
    @track currentStep = 1;
    @track program = {}; 
    @track certificates = [];
    @track onboardings = []; 
    @track interns = []; 
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

    tempCeritificates = [];
    tempOnboardings = [{ Name: '', Checklist__c: '', Received_Date__c: '' }];
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
        } else if (error) {
            this.error = error;
        }
    }

    selectedCategory = 'Program';  // Default category
    dropdownOpen = false;
    categories = [
        { label: 'Program', value: 'Program', iconName: 'custom:custom25' },
        { label: 'Certificates', value: 'Certificates', iconName: 'standard:education' },
        { label: 'Onboardings', value: 'Onboardings', iconName: 'standard:asset_action' },
        { label: 'Interns', value: 'Interns', iconName: 'standard:customers' }
    ];

    // Toggle dropdown visibility
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    }
  
    // Handle category change and update selected category
    handleCategoryChange(event) {
      this.selectedCategory = event.target.closest('li').dataset.value;
      this.dropdownOpen = false;
    }

    get isAssetSelected() {
        return this.onboardings.some(onboarding => onboarding.Type__c === 'Asset');
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
        this.showButton = false;
        this.showProgram = true;
        return this.selectedCategory === 'Program';
      }

    get isCertificatesSelected() {
        this.showButton = true;
        return this.selectedCategory === 'Certificates';
    }

    get isOnboardingSelected() {
        this.showButton = true;
        return this.selectedCategory === 'Onboardings';
    }

    get isInternsSelected() {
        this.showButton = true; 
        return this.selectedCategory === 'Interns';
    }

    handleButtonClick() {
        if (this.selectedCategory === 'Certificates') {
            this.tempCeritificates = [{ id: Date.now()}];
            this.isModalCertificate = true;
        } 
        else if(this.selectedCategory === 'Onboardings'){
            this.tempOnboardings = [{ id: Date.now()}];
            this.isModalOnboarding = true;
        }
        else if(this.selectedCategory === 'Interns'){
            this.tempInterns = [{ id: Date.now()}];
            this.isModalIntern = true;
        }
        else {
            this.showButton = false; 
        }
    }

    get totalItems() {
        if (this.selectedCategory === 'Certificates') {
            return (this.certificates.length);
        } 
        else if(this.selectedCategory === 'Onboardings'){
            return (this.onboardings.length);
        }
        else if(this.selectedCategory === 'Interns'){
            return (this.interns.length);
        }
        else {
            return 0;
        }
    }
    

    // Toggle edit mode for Program, Certificate, Onboarding
    _editProgram() {
        this.isEditingProgram = true;
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
                isSelected: onboarding.Id === rowId
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

        this.onboardings = this.onboardings.map((onboarding) => {
            return { ...onboarding, isSelected: false };
        });
        

        this.interns = this.interns.map((intern) => {
            return { ...intern, isSelected: false };
        });
        this.isEditing = false;
        this.showProgram = true;
    }


    // Handle program field changes
    handleProgramChange(event) {
        const fieldName = event.target.name;
        const value = event.target.value;
        this.program[fieldName] = value;
    }

     // Handle Object field changes
     handleObjectChanges(event) {
        const field = event.target.name;
        const index = event.target.dataset.index;
        const rowId = event.target.dataset.id;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    
        // Helper function to update an array by index and rowId
        const updateArray = (array, tempArray) => {
            // Update the specific index of tempArray
            tempArray[index] = {
                ...tempArray[index],
                [field]: value // Ensure the field is updated in the tempArray
            };
    
            // Update the main array (certificates, onboardings, etc.)
            return array.map(item => {
                if (item.Id === rowId) {
                    return { ...item, [field]: value };
                }
                return item;
            });
        };
    
        // Update all relevant arrays
        this.certificates = updateArray(this.certificates, this.tempCeritificates);
        this.onboardings = updateArray(this.onboardings, this.tempOnboardings);
        this.assets = updateArray(this.assets, this.tempAssets);
        this.interns = updateArray(this.interns, this.tempInterns);
    
        // Check if the field is Type__c and handle the isAssetSelected logic
        if (field === 'Type__c') {
            this.isAssetSelected = value === 'Asset';
            console.log(this.isAssetSelected); // Log whether Asset is selected
        }
    }
    

    // Add a new certificate row dynamically
    addCertificate() {
        const newRow = { id: Date.now(), Name: '', Authority_By__c: '' };
        this.tempCeritificates = [...this.tempCeritificates, newRow];
    }

    // Add a new onboarding row dynamically
    // addOnboarding() {
    //     const newRow = { id: Date.now(), Name: '', Authority_By__c: '' };
    //     this.tempOnboardings = [...this.tempOnboardings, newRow];
    // }

    addAsset() {
        const newAsset = {
            id: Date.now(),
            Name: '',
            Serial_Number__c: '',
            Status__c: '',
            Assigned_Date__c: ''
    
        };
    
        this.tempAssets = [...this.tempAssets, newAsset];
        console.log('Added new asset:', newAsset.id);
    }

    // Add a new intern row dynamically
    addIntern() {
        const newRow = { id: Date.now(), User__c: '', Training_Program__c: '' };
        this.tempInterns = [...this.tempInterns, newRow];
    }

    // Delete a row based on the ID
    deleteRow(event) {
        const rowId = parseInt(event.target.dataset.id, 10);
        console.error('Row ID:', rowId);

        if (this.tempCeritificates.length === 1 && this.tempOnboardings.length === 1 && this.tempAssets.length === 1 && this.tempInterns.length === 1) {
            console.error('Cannot delete the default row.');
            return;
        }

        // Remove rows from respective temp collections
        this.tempCeritificates = this.tempCeritificates.filter(cert => cert.id !== rowId);
        this.tempInterns = this.tempInterns.filter(intern => intern.id !== rowId);

        this.tempOnboardings = this.tempOnboardings.filter(onboarding => onboarding.id !== rowId);
        this.tempAssets = this.tempAssets.filter(asset => asset.id !== rowId);
        console.log('Deleted asset:', assetId);
    }

    handleSubmit() {
        this.isLoading = true;
        this.certificates = [...this.certificates, ...this.tempCeritificates];
        this.onboardings = [...this.onboardings, ...this.tempOnboardings];
        this.assets = [...this.assets, ...this.tempAssets];
        this.interns = [...this.interns, ...this.tempInterns];

        const certificatesData = this.certificates.map((cert) => ({
            Id: cert.Id || null, 
            Name: cert.Name,
            Authority_By__c: cert.Authority_By__c,
            
        }));

    
        // Format the onboardings
        const onboardingsData = this.onboardings.map((onboarding) => ({
            Id: onboarding.Id || null, 
            Name: onboarding.Name,
            Checklist__c: onboarding.Checklist__c,
            Received_Date__c: onboarding.Received_Date__c,
        }));

        // Format the assets
        const assetsData = this.assets.map((asset) => ({
            Id: asset.Id || null, 
            Name: asset.Name,
            // Account__c: asset.Account__c,
            // Assigned_Date__c: asset.Assigned_Date__c,
            // Condition_After__c: asset.Condition_After__c,
            // Condition_Before__c: asset.Condition_Before__c,
            // Contact__c: asset.Contact__c,
            // Returned_Date__c: asset.Returned_Date__c,
            Serial_Number__c: asset.Serial_Number__c,
            Status__c: asset.Status__c,
            // Onboarding__c: asset.Onboarding__c
            
        }));

        const internsData = this.interns.map((intern) => ({
            Id: intern.Id || null,  
            User__c: intern.User__c || this.selectedUser.Id,
            Training_Program__c: intern.Training_Program__c || this.selectedTraining.Id,
        }))
    
        // Format the program itself
        // const formattedProgram = {
        //     programName: this.program.Name,
        //     department: this.program.Department__c,
        //     programtype: this.program.Program_Type__c,
        //     startDate: this.program.Start_Date__c,
        //     endDate: this.program.End_Date__c,
        // };
    
    
        // Logging for debugging
        // console.log('Formatted Certificates:', JSON.stringify(certificatesData));
        // console.log('Formatted Onboardings:', JSON.stringify(onboardingsData));
        console.log('Formatted Assets:', JSON.stringify(assetsData));
        // console.log('Formatted Program:', JSON.stringify(internsData));

        if (this.selectedCategory === 'Certificates') {
            createCertificates({certificates : certificatesData, programId: this.recordId  })
            .then(() => {
                this.showToast('Success', 'Records created/updated successfully!', 'success');
                this._editingStop();
                this.isLoading = false;
            })
            .catch((error) => {
                console.error('Error:', JSON.stringify(error));
                this.showToast('Error', 'An error occurred: ' + error.body.message, 'error');
                this.isLoading = false;
            });
        } 
        else if(this.selectedCategory === 'Onboardings'){
            createOnboardings({onboardings : onboardingsData, programId: this.recordId  })
            .then(() => {
                return createAssets({assets: assetsData, programId: this.recordId  })
            })
            .then(() => {
                this.showToast('Success', 'Records created/updated successfully!', 'success');
                this._editingStop();
                this.isLoading = false;
            })
            .catch((error) => {
                console.error('Error:', JSON.stringify(error));
                this.showToast('Error', 'An error occurred: ' + error.body.message, 'error');
                this.isLoading = false;
            });
        }
        else if(this.selectedCategory === 'Interns'){
            createInterns({certificates : certificatesData, onboardings : onboardingsData, assets: assetsData, interns : internsData, programId: this.recordId  })
            .then(() => {
                this.showToast('Success', 'Records created/updated successfully!', 'success');
                this._editingStop();
                this.isLoading = false;
            })
            .catch((error) => {
                console.error('Error:', JSON.stringify(error));
                this.showToast('Error', 'An error occurred: ' + error.body.message, 'error');
                this.isLoading = false;
            });
        }
        else {
            return 0;
        }
    

    }




    _handleSearch(event) {
        this._searchKey = event.target.value.toLowerCase();
        console.log('_Search Key:', this._searchKey);
        if (this._searchKey) {
            this._searchResults = this.users.filter(user => {
                const nameMatches = user.Id && user.Name.toLowerCase().includes(this._searchKey );
    
                console.log('_Name Match:', user.Name, nameMatches);
    
                return nameMatches;
            });
    
            console.log('_Filtered Results:', this._searchResults);
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

        console.log("User ID: ",userId)

        if (userId && this.selectedUser && this.selectedUser.Id === userId) {
            this.selectedUser = null;
            this.interns = [];
            this.trainings = [];
            this._isshow = false;
        } 
    }

    handleSearch(event) {
        this.searchKey = event.target.value.toLowerCase();
        console.log('Search Key:', this.searchKey);
        if (this.searchKey) {
            this.searchResults = this.trainings.filter(training => {
                const nameMatches = training.Id && training.Name.toLowerCase().includes(this.searchKey );
    
                console.log('Name Match:', training.Name, nameMatches);
    
                return nameMatches;
            });
    
            console.log('Filtered Results:', this.searchResults);
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
        console.log("training ID: ",trainingId);

        if (trainingId && this.selectedTraining && this.selectedTraining.Id === trainingId) {
            this.selectedTraining = null;
            this.isshow = false;
            this.isFocus = false;
        } 
    }
    
    handingClose() {
        this._editingStop();
    }

    closeModel() {
        this.tempCeritificates = [];
        this.tempOnboardings = [];
        this.tempInterns = [];
        this.isModalCertificate = false;
        this.isModalOnboarding = false;
        this.isModalIntern = false;
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
