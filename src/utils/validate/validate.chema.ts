import * as Yup from 'yup';
export const LoginSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, 'Password cần tối thiểu 6 kí tự')
        .max(50, 'Password tối đa 50 kí tự')
        .required('Password không được để trống'),
    email: Yup.string()
        .email('Định dạng email không hợp lệ')
        .required('Email không được để trống'),
});

export const SignUpSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('Họ không được để trống'),
    lastName: Yup.string()
        .required('Tên không được để trống'),
    password: Yup.string()
        .min(6, 'Password cần tối thiểu 6 kí tự')
        .max(50, 'Password tối đa 50 kí tự')
        .required('Password không được để trống'),
    confirmPassword: Yup.string()
        .required('Bạn cần xác thực lại mật khẩu')
        .oneOf([Yup.ref('password')], 'Mật khẩu không khớp'),
    email: Yup.string()
        .email('Định dạng email không hợp lệ')
        .required('Email không được để trống'),
    dob: Yup.date()
        .required('Ngày sinh không được để trống')
        .max(new Date(), "Ngày sinh không hợp lệ")
});

export const RequestPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email('Định dạng email không hợp lệ')
        .required('Email không được để trống'),
});

export const ForgotPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, 'Password cần tối thiểu 6 ký tự')
        .max(50, 'Password tối đa 50 ký tự')
        .required('Password không được để trống'),
    confirmPassword: Yup.string()
        .required('confirmPassword không được để trống')
        .oneOf([Yup.ref('password')], 'Passwords không khớp'),
    code: Yup.string()
        .min(6, 'Code cần tối thiểu 6 ký tự')
        .max(6, 'Code tối đa 6 ký tự')
        .required('Code không được để trống'),
        
});

export const EditProfileSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('Họ không được để trống'),
    lastName: Yup.string()
        .required('Tên không được để trống'),
});

export const VerifySchema = Yup.object().shape({
    code: Yup.string()
        .length(6, 'Mã xác thực phải có 6 số')
        .required('Vui lòng nhập mã xác thực'),
});