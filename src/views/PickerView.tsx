import React from 'react';

import Sheet from './Sheet';
import Button from './Button';
import Picker from './Picker'

interface PickerViewProps {
    data: Array<Array<Object>>,
    values: Array<string | number>,
    onChange?: Function,
    onEnsure?: Function
}

interface GlobalAttr {
    values: Array<string>,
    indexes: Array<number>
}

let _attr:GlobalAttr = {
    values: [],
    indexes: []
}

class PickerView extends React.Component<PickerViewProps> {

    constructor(props: PickerViewProps) {
        super(props);
    }

    ensureHandler = () => {
        if (typeof this.props.onEnsure === 'function') {
            this.props.onEnsure(_attr.values, _attr.indexes)
        }
    }

    onChangeHandler = (values: Array<string>, indexes: Array<number>) => {
        _attr = { values, indexes }
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(values, indexes)
        }
    }

    render() {
        return <Sheet
            ensureHandler={this.ensureHandler}
            button={<Button>弹出Picker</Button>}>
            <Picker
                data={this.props.data}
                values={this.props.values}
                onChange={this.onChangeHandler}>
            </Picker>
        </Sheet>
    }
}

export default PickerView;