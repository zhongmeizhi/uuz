import React from 'react';

import Sheet from './Sheet';
import Button from './Button';

class Picker extends React.PureComponent {

    // constructor() {
    //     super();
    // }

    ensureHandler = () => {
        console.log('ensureHandler')
    }

    render() {
        return <Sheet
            canModalClose={false}
            ensureHandler={this.ensureHandler}
            button={<Button>弹出Picker</Button>}>
            <div className="zui-picker">
                <div>Sheet</div>
                <div>Sheet</div>
                <div>Sheet</div>
            </div>
        </Sheet>
    }
}

export default Picker;