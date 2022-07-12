import PropTypes from 'prop-types';
// form
import {useFormContext, Controller} from 'react-hook-form';
// @mui
import {Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select} from '@mui/material';

// ----------------------------------------------------------------------

RHFCheckbox.propTypes = {
    name: PropTypes.string.isRequired,
};

export function RHFCheckbox({name, ...other}) {
    const {control} = useFormContext();

    return (
        <FormControlLabel
            control={
                <Controller
                    name={name}
                    control={control}
                    render={({field}) => <Checkbox {...field} checked={field.value}/>}
                />
            }
            {...other}
        />
    );
}

// ----------------------------------------------------------------------

RHFSelect.propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    label: PropTypes.string,
};

export function RHFSelect({name, children, label, ...other}) {
    const {control} = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState: {error}}) => (
                <FormControl fullWidth>
                    {label && <InputLabel>{label}</InputLabel>}
                    <Select
                        {...field}
                        fullWidth
                        error={!!error}
                        value={field.value}
                        label={label}
                        {...other}
                    >
                        {children}
                    </Select>
                </FormControl>
            )}
        />
    );
}
