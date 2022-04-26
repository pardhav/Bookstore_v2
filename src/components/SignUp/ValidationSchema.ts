import * as Yup from "yup";

export const SignupSchema = Yup.object().shape({
  "given-name": Yup.string().min(2, "Too Short!").max(50, "Too Long!"),
  "family-name": Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().required("Email is Required").email("Invalid email"),
  password: Yup.string()
    .min(8, "Must be at least 8 charecters")
    .max(16, "Must be less than 16 charecters")
    .required("Password is Required"),
  "tel-national": Yup.number().required("Mobile Number is required").positive(),
  "street-address": Yup.string().required("Street is Required"),
  line2: Yup.string(),
  "address-level2": Yup.string(),
  state: Yup.string(),
  "postal-code": Yup.string().test(
    "len",
    "Postal Code Must be exactly 5 characters",
    (val) => val?.length === 5
  ),
});
