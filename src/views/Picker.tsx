import React from 'react';

import Sheet from './Sheet';
import Button from './Button';

class Picker extends React.PureComponent {

    // constructor() {
    //     super();
    // }

    render() {
        return <Sheet
            canModalClose={false}
            button={<Button>弹出Picker</Button>}>
            <div>Sheet</div>
        </Sheet>
    }
}

export default Picker;