import OnboardingOne from 'mangarine/pages/auth/onboarding/onboarding-one'
import React from 'react'

const OnboardingContainer = () => {


    const handleSignupPages = () => {
        return <OnboardingOne />
    }
    return handleSignupPages()
}

export default OnboardingContainer