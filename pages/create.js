import React, { useState } from 'react';

const Create = () => {
    const initialValues = {
        company: "",
        position: "",
        link: "",
        date: "",
        note: "",
    };
    const [values, setValues] = useState(initialValues);

    const handleInputChange = (e) => {
      const { name, value } = e.target;

      console.log(name)
      setValues({
        ...values,
        [name]: value,
      });
    };

    const generateHikeData = (e) => {
        console.log(initialValues)
    }
  
    return (
          <form onSubmit={generateHikeData}>
            <input
              value={values.company}
              onChange={handleInputChange}
              name="company"
              label="Company"
            />
            <input
              value={values.position}
              onChange={handleInputChange}
              name="position"
              label="Job Title"
            />
             <p>{JSON.stringify(initialValues)}</p>
            <button  type="submit"> Submit </button>
          </form>
    );
}

export default Create;
