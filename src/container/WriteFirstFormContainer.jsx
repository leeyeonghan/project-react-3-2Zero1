import React from 'react'

import WriteFirstForm from '../presentational/WriteFirstForm';

import placeholders from '../text/placeholders';
import errorMessages from '../text/errorMessages';
import { useDispatch, useSelector } from 'react-redux';
import validator from '../utils/validator';

import {
  changeInputFieldValue,
  changeRadioChecked,
  setInputFieldsError,
} from '../state/slice';

const getField = ({ field: { value, error }, id, name, onChange }) => ({
  id,
  name,
  value,
  placeholder: placeholders[id],
  errorMessage: error ? errorMessages[id] : '',
  onChange,
});

export default function WriteFirstFormContainer({ onClickNext }) {

  const dispatch = useDispatch();

  const getWritePageChangeHandler = (type) => {
    return ((value) => {
      dispatch(changeInputFieldValue({
        page: 'write',
        type,
        value,
      }));
    });
  };
  
  const { inputFields: {
    write: {
      sender,
      receiver,
      secretMessage,
      isPrivate,
    },
    }} = useSelector((state) => ({
      inputFields: state.inputFields
    }));

  const fields = {
    sender: getField({
      field: sender,
      id: 'sender',
      name: '보내는 사람',
      onChange: getWritePageChangeHandler('sender'),
    }),
    receiver: getField({
      field: receiver,
      id: 'receiver',
      name: '받는 사람',
      onChange: getWritePageChangeHandler('receiver'),
    }),
    secretMessage: getField({
      field: secretMessage,
      id: 'secretMessage',
      name: '비밀 메시지',
      onChange: getWritePageChangeHandler('secretMessage'),
    }),
  };

  function handleRadioChange(event) {
    const { target: { value } } = event;
    dispatch(changeRadioChecked(value));
    
  }

  function handleClick() {
    const sendCheck = validator.sender(sender.value);
    const receiverCheck = validator.receiver(receiver.value);
    const secretMessageCheck = validator.secretMessage(secretMessage.value);
    
    const checks = {
      sender: sendCheck,
      receiver: receiverCheck,
      secretMessage: secretMessageCheck,
    };

    if(Object.entries(checks).filter(([_, check]) => !check).length !== 0) {
      Object.entries(checks).forEach(([key, checked]) => {
          dispatch(setInputFieldsError({
            page: 'write',
            type: key,
            error: !checked,
          }));
      });
      return;
    }
    
    onClickNext();
    
  }

  return (
    <>
      <WriteFirstForm
        onHandleClick={handleClick}
        fields={fields}
        isPrivate={isPrivate}
        onHandleRadioChange={handleRadioChange}
      />
    </>
  );
}
