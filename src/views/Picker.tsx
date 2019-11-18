import React from 'react';

import Sheet from './Sheet';

class Picker extends React.Component {

    // constructor() {
    //     super();
    // }

    render() {
        return <Sheet
            canModalClose={false}
            button={<button>弹出Picker</button>}>
            <div>Sheet</div>
        </Sheet>
    }
}

export default Picker;