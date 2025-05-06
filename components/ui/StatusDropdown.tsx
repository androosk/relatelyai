import React, { useState } from 'react';
import DropDownPicker, { DropDownPickerProps, ValueType } from 'react-native-dropdown-picker';

type StatusItem = { label: string; value: string };

interface StatusDropdownProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({ value, setValue }) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<StatusItem[]>([
    { label: 'Single', value: 'Single' },
    { label: 'Dating', value: 'Dating' },
    { label: 'Partnered', value: 'Partnered' },
    { label: 'Engaged', value: 'Engaged' },
    { label: 'Married', value: 'Married' },
    { label: "It's complicated", value: 'Complicated' },
  ]);

  return (
    <DropDownPicker<string>
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      placeholder="Select status"
      listMode="SCROLLVIEW"
      scrollViewProps={{ nestedScrollEnabled: true }}
      style={{
        borderColor: '#D1D5DB',
        borderRadius: 8,
        backgroundColor: 'white',
      }}
      dropDownContainerStyle={{
        borderColor: '#D1D5DB',
        backgroundColor: 'white',
      }}
    />
  );
};
