import Form from "./Form"
import styled from "styled-components";

const FormRow = styled.div`
    display: grid;
    align-items: center;
    grid-template-columns: 24rem 1fr 1.2fr;
    gap: 2.4rem;
    padding: 1.2rem 0;
`;

const Input = styled.input`
  border: 1px solid #d1d5db;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  padding: 0.8rem 1.2rem;
`;

function CreateTicketForm() {
    return (
        <Form>
            <FormRow>
                <label>OIB: </label>
                <Input required="This field is required!"></Input>
            </FormRow>
            <FormRow>
                <label>Ime: </label>
                <Input required="This field is required!"></Input>
            </FormRow>
            <FormRow>
                <label>Prezime: </label>
                <Input required="This field is required!"></Input>
            </FormRow>
        </Form>
    )
}

export default CreateTicketForm;
