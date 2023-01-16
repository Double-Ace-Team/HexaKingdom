export function getFormData(target: HTMLFormElement)
{
    const formData = new FormData(target);
    const formDataObj = Object.fromEntries(formData.entries());

    return formDataObj;
}