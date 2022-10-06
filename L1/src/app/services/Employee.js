import axios from 'axios';
import ConstantList from '../../app/appConfig'

const getEmployee = async () => {
    try {
        const response = await axios.get(ConstantList.API_ENPOINT + '/employees/excel/export');
        console.log(response);
        return response
    } catch (error) {
        console.error(error);
    }
}

const postEmployee = async ({ name, description, required, schema }) => {
    const response = await axios.post(
        ConstantList.API_ENPOINT + '/employees',
        {
            name: name,
            description: description,
        }
    );
    return response
}

const putEmployee = async ({ id, name }) => {

    const response = await axios.put(
        ConstantList.API_ENPOINT + '/employees/' + id,
        {
            name,
        }
    )
    return response
}

const deleteEmployee = async ({ id }) => {
    
    const response = await axios.delete(
        ConstantList.API_ENPOINT + '/employees/' + id)
    return response
}

const searchEmployee = async ({ code, name }) => {

    const response = await axios.post(
        ConstantList.API_ENPOINT + '/employees', {
        code, name
    })
    return response
}

export { getEmployee, postEmployee, putEmployee, deleteEmployee, searchEmployee }



