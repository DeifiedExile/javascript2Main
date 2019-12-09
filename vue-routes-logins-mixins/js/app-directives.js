Vue.directive('focus', {
    //before element is added to dom
    bind: function(el, binding){

    },
    //after element is added to dom
    inserted: function(el, binding){
        el.focus();

    },
    //anytime element is updated
    update: function(el, binding){

    },
    //after the component and children components/nodes are updated
    componentUpdated: function(el, binding){

    },
    //when the element is removed from the dom
    unbind: function(el, binding){

    }
});
//make field required and add validation
Vue.directive('required', {
    //before element is added to dom
    bind: function(el, binding){
        el.required = true; //sets html required attribute
    },
    //after element is added to dom
    inserted: function(el, binding){
        let star = document.createElement('span');
        star.innerText = '*';
        star.className = 'text-danger px-2';

        let label = document.querySelector('label[for = "' + el.id + '"]');
        label.append(star);

    },
    //anytime element is updated
    update: function(el, binding){
        //add a red border if element is empty
        if(el.value &&  binding.value){
            if(el.value.length < binding.value){
                el.classList.add('border-danger');
            }
            else
            {
                el.classList.remove('border-danger');
            }

        }
        else if(el.value)
        {
            el.classList.remove('border-danger');
        }
        else{
            el.classList.add('border-danger');
        }

        //check if is date
        switch(binding.arg)
        {
            case "date":
                let d = el.value.split("-");
                let thisDate = new Date(d[0], d[1] - 1, d[2], 0, 0, 0);
                let today = new Date();
                if(binding.modifiers.future && thisDate < today){
                    el.classList.add('border-danger');
                }
                else
                {
                    el.classList.remove('border-danger');
                }
                break;
        }

    },
    //after the component and children components/nodes are updated
    componentUpdated: function(el, binding){

    },
    //when the element is removed from the dom
    unbind: function(el, binding){

    }
});

