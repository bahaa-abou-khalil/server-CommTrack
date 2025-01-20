export const validatePassword = (password)=>{
    let schema = new passwordValidator();
    schema
    .is().min(6)
    const error = schema.validate(password, { details: true });
    const errorMessage = String(error.map(error => error.message));
    const validPassword = schema.validate(password)
    return {errorMessage, validPassword}
}