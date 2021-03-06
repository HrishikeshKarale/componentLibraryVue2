<template>
  <div class="vueDate" :class="{ inline: inline }">
    <label v-if="label" :class="{ maskField: mask }">
      {{ label }}
      <abbr v-if="required" title="Required Field">*</abbr>
      <span v-else> - Optional field<abbr>*</abbr></span>
    </label>
    <div
      :class="{
        warningContainer: alert ? alert.warning : false,
        errorContainer: alert ? alert.error : false,
        iconPadding: icon,
        maskField: mask
      }"
    >
      <span v-if="icon" :class="icon" />
      <input
        v-if="!mask"
        type="date"
        :name="name"
        v-model="d_value"
        :max="max"
        :min="min"
        :autofocus="autofocus"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        @blur="validate"
      />
    </div>
    <input-response :d_warning="d_warning" :error="d_danger" />
  </div>
</template>

<script>
import inputResponse from "@/components/Alerts/inputResponse";
import { validator } from "@/typeScript/validator";
import { alerts } from "@/typeScript/common/alerts";

export default {
  name: "vueDate",

  mixins: [validator, alerts], //mixins

  components: {
    inputResponse
  }, //components
  props: {
    //sets heading/Label for the input field
    label: {
      required: false,
      type: String,
      default: null
    },

    //sets name attribute for the input field (required field in case of forms)
    name: {
      required: false,
      type: String,
      default: "dateInput"
    },

    //users can pass preset values for the input field
    value: {
      required: false,
      type: [Date, String],
      default: function() {
        if (this.setDefaultDate) {
          return this.getDate();
        }
        return null;
      }
    },

    //if true sets the default date for the field to be current/todays date.
    //value prop takes presedence over this props
    //if value is set, setDefault Date status is neglected
    setDefaultDate: {
      required: false,
      type: Boolean,
      default: false
    },

    //sets the min attribute for the input field
    min: {
      required: false,
      type: [Date, String],
      default: "1990-01-01"
    },

    //sets the max attribute for the input field
    max: {
      required: false,
      type: [Date, String],
      default: "2030-01-01"
    },

    //sets the format/pattern for acceptable values for the input field
    pattern: {
      required: false,
      type: [RegExp, String],
      default: function() {
        return new RegExp(
          /^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/
        );
      }
    },

    //sets the manual alerts
    alert: {
      required: false,
      type: Object,
      default: () => {
        return {
          error: "",
          warning: ""
        };
      }
    },

    //sets the required attribute for the input field
    required: {
      required: false,
      type: Boolean,
      default: false
    },

    //sets the disabled attribute for the input field
    disabled: {
      required: false,
      type: Boolean,
      default: false
    },

    //sets the autofocus attribute for the input field
    autofocus: {
      required: false,
      type: Boolean,
      default: false
    },

    //sets the readonly attribute for the input field
    readonly: {
      required: false,
      type: Boolean,
      default: false
    },

    //if a valid fontawesome icon class string is passed, it displays it in the input field
    //a valid fontawesome icons class string is a string which starts with fas/far/fab/fa
    icon: {
      required: false,
      type: String,
      default: null
    },

    //reserves space and created a mask if set to true
    mask: {
      required: false,
      type: Boolean,
      default: false
    },

    //checks if label options should appear on the same line or not
    inline: {
      required: false,
      type: Boolean,
      default: false
    }
  }, //props

  methods: {
    //validate the textbox input and set alert messages if required.
    //it also emits/send the current textbox value to  parent component as v-model attribute value
    validate: function() {
      // console.log(this.d_value)

      //initialize d_warning and error messages to null to accomodate change in alert messages
      this.d_danger = null;
      this.d_warning = null;
      //loads current value stored from data variables into temp variable val for readability of code
      const val = this.d_value;
      const min = this.min;
      const max = this.max;
      const pattern = new RegExp(this.pattern);

      //emit/send new values to parent component v-model attribute
      this.$emit("input", val);

      //if value for val(temp) exists check for d_warning triggers
      if (val) {
        if (min && this.isDateHigherOrSameAs(min, val)) {
          this.d_warning = "Invalid Date: Please select a date after " + min;
        } else if (max && this.isDateHigherOrSameAs(val, max)) {
          this.d_warning = "Invalid Date: Please select a date before " + max;
        } else if (pattern && !val.match(pattern)) {
          // console.log(val.test(pattern), val, pattern)
          this.d_warning =
            "Wrong date format: Please follow the pattern " + pattern;
        }
      }
      //if a value for val(temp) does not exists  and is required, thentrigger error and set error message
      else {
        if (this.required) {
          this.d_danger = "Required field: Please select a valid date value";
          return;
        }
      }
    }, //validate

    //compare string dates send a false value if lowValue is lower to highValue
    //sends true if lowValue is higher than or equal to highvalue
    isDateHigherOrSameAs: function(lowValue, highValue) {
      //store date min year and convert them into numbers
      let tempLow = lowValue.substr(0, 4);
      const lowYear = parseInt(tempLow, 10);
      //store date max year and convert them into numbers
      let tempHigh = highValue.substr(0, 4);
      const highYear = parseInt(tempHigh, 10);

      //check if year is a number
      if (typeof lowYear == "number" && typeof highYear == "number") {
        //compare years and send a boolean value if not different
        if (lowYear < highYear) {
          return false;
        } else if (lowYear > highYear) {
          return true;
        }
        //if years are same compare months
        else {
          //stores the date min month and converts it into number
          vtempLow = lowValue.substr(5, 2);
          const lowMonth = parseInt(tempLow, 10);
          //stores the date max month and converts it into number
          tempHigh = highValue.substr(5, 2);
          const highMonth = parseInt(tempHigh, 10);

          //check if month are number's
          if (typeof lowMonth == "number" && typeof highMonth == "number") {
            //compare month and send a boolean value if not different
            if (lowMonth < highMonth) {
              return false;
            } else if (lowMonth > highMonth) {
              return true;
            }
            //if months are same compare dates
            else {
              //stores the date min date and converts it into number
              tempLow = lowValue.substr(8, 2);
              const lowDate = parseInt(tempLow, 10);
              //stores the date max date and converts it into number
              tempHigh = highValue.substr(8, 2);
              const highDate = parseInt(tempHigh, 10);
              //check if date are number's
              if (typeof lowDate == "number" && typeof highDate == "number") {
                //compare date and send a boolean false if low date is lower than lowValue
                //send a boolean true if its greater or equal to highdate
                if (lowDate < highDate) {
                  return false;
                } else if (lowDate >= highDate) {
                  return true;
                }
              }
            }
          }
        }
      }
      // if either the year/month/date from eithr lowValue or highValue are not numbers then trigger an alert and set error message
      this.d_danger =
        "Invalid Input: Please make sure value is either a Date or a String";
      return null;
    }, //isDateHigherOrSameAs

    //return todays date converted into string
    getDate: function() {
      //get todays date
      const today = new Date();
      //format the date in a YYYY-MM-DD format and set it to temp variable
      const year = today.getFullYear();
      const month = this.toTwoDigits(today.getMonth() + 1);
      const day = this.toTwoDigits(today.getDate());
      const temp = year + "-" + month + "-" + day;

      //sendoremit todays date as default date for the field
      this.$emit("value", temp);
      return temp;
    }, //getDate

    //convert input number into a 2 digit number
    toTwoDigits: function(num) {
      if (num < 10) {
        return "0" + num;
      }
      return num;
    } //toTwoDigits
  }, //methods

  created() {
    this.d_needsValidation = false;
    //store values passed as props into d_value for future manipulation
    //if a value is not passed it checks if a setDefaultDate value flag is checked
    if (this.value) {
      this.d_value = this.value;
    }
    //if a setDefaultDate flag is checked it sets the date to todays date
    else if (this.setDefaultDate) {
      this.d_value = this.getDate();
    }
  } //created
}; //default
</script>

<style lang="less" scoped>
@import (reference) "./../../Less/customMixins.less";

.vueDate {
  min-width: 200px;
  max-width: 240px;

  .inputcss();
}
</style>
