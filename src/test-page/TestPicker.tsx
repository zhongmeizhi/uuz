import React from 'react';

import Picker from '../views/Picker';

class TestPicker extends React.Component {

    changeHandler = (values: Array<string>, indexes: Array<number>) => {
        console.log(values, indexes)
    }

    render() {
        const data = [
            [
                {
                    value: '1',
                    label: 'test1'
                },{
                    value: '111',
                    label: 'test111'
                },
            ], [
                {
                    value: '2',
                    label: 'test2'
                },{
                    value: '222',
                    label: 'test222'
                },
            ]
        ]
        return <div>
            <Picker
                data={data}
                values={['1', '222']}
                onChange={this.changeHandler}>
            </Picker>
        </div>
    }
}

export default TestPicker;