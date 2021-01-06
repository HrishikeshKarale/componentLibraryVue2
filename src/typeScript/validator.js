export const validator = {
  data() {
    //stores errors thrown by the input fields
    const dDanger = "";
    //stores errors thrown by the input fields
    const dWarning = "";
    //stores textbox values
    const dValue = null;
    //flag used to trigger validator()
    const dNeedsValidation = true;
    return {
      dDanger,
      dWarning,
      dValue,
      dNeedsValidation
    };
  }, //data

  methods: {
    //validate the textbox input and set alert messages if required.
    //it also emits/send the current textbox value to  parent component as v-model attribute value
    validate: function() {
      const object = {
        value: this.dValue,
        maxlength: this.maxLength,
        minlength: this.minLength,
        pattern: this.pattern
      };
      const response = this.validator(object);
      this.dDanger = response.error;
      this.dWarning = response.warning;
    }, //validate

    validator: function(object) {
      //if value for val(temp) exists check for warning triggers
      if (object.value) {
        //if a patters for acceptable value exists, then trigger warning and set warning message if val (temp) does not follow the patter
        if (
          object.pattern &&
          this.followsPattern(object.pattern, object.value)
        ) {
          this.dWarning = "Wrong format: Please follow the pattern.";
        } else if (object.minlength) {
          this.dWarning = this.isTooShort(object.minlength, object.value);
        } else if (object.maxlength) {
          this.dWarning = this.isTooLong(object.maxlength, object.value);
        } else {
          //emit/send new values to parent component v-model attribute
          this.$emit("value", object.value);
        }
      }
      //if a value for val(temp) does not exists  and is required, thentrigger error and set error message
      else {
        this.dDanger = this.isRequired();
      }

      return { warning: this.dWarning, error: this.dDanger };
    }, //validator

    //value ebsent
    isRequired: function() {
      if (this.required) {
        return "Required field.";
      }
      return "";
    }, //isRequired

    //value present
    isTooShort: function(minlength, value) {
      if (minlength > value.length) {
        return (
          "Invalid Input: Allowed minlength for input is " +
          minlength +
          " characters."
        );
      }
      return "";
    }, //isTooShort
    isTooLong: function(maxlength, value) {
      if (maxlength < value.length) {
        return (
          "Invalid Input: Allowed maxlength for input exceeded by " +
          (maxlength.length - value.length) +
          " characters."
        );
      }
      return "";
    }, //isTooLong

    //pattern matching
    followsPattern: function(pattern, value) {
      //if not regexp, convert to regexp
      if (!pattern.test(value)) {
        return "Wrong email format: Please follow the pattern " + pattern;
      } else "";
    } //followsPattern
  },

  beforeMount() {
    const alert = this.alert;
    //load alerts sent via component
    if (alert) {
      if (alert["error"]) {
        this.dDanger = alert["error"];
      } else if (alert["warning"]) {
        this.dWarning = alert["warning"];
      } else if (alert["success"]) {
        this.dSuccess = alert["success"];
      } else if (alert["info"]) {
        this.dInfo = alert["info"];
      }
    }
    //store values passed as props into dValue for future manipulation
    if (this.value) {
      this.dValue = this.value;

      if (this.dNeedsValidation) {
        this.validate();
      }
    }
  }, //beforeMount

  watch: {
    //send warning messages back to parent component
    dWarning: function(newValue) {
      this.$emit("notify", "warning", newValue);
    },

    //send error messages back to parent component
    dDanger: function(newValue) {
      this.$emit("notify", "error", newValue);
    }
  } //methods
};
