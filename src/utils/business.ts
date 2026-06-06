
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
    }, {
        text: 'Calendar',
        title: 'calendar'
    }, {
        text: 'Upcoming Appointments',
        title: 'upcoming_appointments'
    }, {
        text: 'Consultation History',
        title: 'consultation_history'
    }
]
const accountItems : meetingType[] = [
    {
        text: 'Feedback/Review',
        title: 'feedback'
    }
]

export {meetingItems, accountItems}