
export interface meetingType {
    text: string,
    title: string,
}

const meetingItems : meetingType[] = [
    {
        text: 'Availability Settings',
        title: 'availability_settings'
    }, {
        text: 'Meeting Preference',
        title: 'preferences'
    }, {
        text: 'Pricing',
        title: 'pricing'
    }
]
const accountItems : meetingType[] = [
    {
        text: 'Feedback/Review',
        title: 'feedback'
    }, {
        text: 'Payment Settings',
        title: 'payment'
    }
]

export {meetingItems, accountItems}