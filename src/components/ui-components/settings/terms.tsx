import { Box } from "@chakra-ui/react";
import React from "react";
import HeaderContent from "./headercontent";
import LegalContent from "./legalcontents";
import ContentComp from "./contentcomp";
import ContentCompWithSubs from "./contentcompwithsubs";

export const Terms = ({ onClick }) => {
  return (
    <Box
      borderRadius="lg"
      boxShadow="lg"
      bg="main_background"
      p={8}
      //   w="full"
      h="auto"
      overflowY={"scroll"}
      //px={6}
      //py={6}
      // marginLeft={40}
      mt={0}
    >
      <Box pb="6">
        <HeaderContent
          desc=""
          extra=""
          onClick={onClick}
          title="Terms and Conditions of Service"
        />
      </Box>
      <ContentComp
        extra=""
        desc=""
        title="Effective Date: 1st August 2025"
        intro='Welcome to Mangerine (the "Service"). By accessing and using the Service, you agree to
comply with and be bound by these Terms and Conditions (the "Agreement"). This
Agreement outlines the terms governing your use of the Service, including consultations,
video features, recordings, and other related services. Please read these terms carefully
before using the Service.'
      />
      <ContentComp
        extra="By using the Service, you agree to these Terms and Conditions,
including any modifications or updates that may be made from time to time. If you do not
agree to these terms, you should not use the Service."
        title="1. General Terms"
        desc="1.1 Acceptance of Terms:"
      />
      <ContentComp
        extra='Mangerine allows users (the "User") to book professional consultations
with consultants (the "Consultant") across various fields (e.g., legal, medical, technical, etc.) via
video calls. The Service is available globally, and consultants and users may be located in
different jurisdictions.'
        title=""
        desc="1.2 Service Description: Mangerine"
      />
      <ContentComp
        extra="You must be at least 18 years of age to use this Service. By using the Service, you
confirm that you are of legal age to form a binding contract."
        title=""
        desc="1.3 Eligibility:"
      />
      <ContentComp
        extra="Users can book consultations with Consultants by selecting a Consultant’s
profile, choosing an available time slot, and completing the booking process. All consultations
are scheduled on an hourly basis, with a 10-minute allowance for the Consultant to join the
video call."
        title="2. Booking Consultations and Late Arrivals"
        desc="2.1 Booking Process:"
      />
      <ContentCompWithSubs
        extra1="Consultants are expected to join the session within 10
minutes of the scheduled start time. If the Consultant is late beyond this, it will be
recorded in their metrics and may impact their ranking and future bookings."
        title="Consultant Late Arrivals:"
        desc1=" Consultant Late by 10 Minutes:"
        desc2=" Consultant Late by 20 Minutes:"
        extra2="If the Consultant is late by more than 20 minutes, the
User has the right to either:
o Cancel the consultation and request a full refund,
o Reschedule the consultation at no additional cost, or
o If confident that the remaining time is sufficient to address the matter, the User
may continue with the consultation for the remaining time (up to 40 minutes)."
        desc3=" Consultant’s Accountability:"
        extra3="Any delays beyond 10 minutes from the scheduled start
will be considered a failure to meet professional standards and will impact the
Consultant’s metrics, which may affect their future bookings."
      />
      <ContentComp
        extra=""
        title="3. Cancellations, Reschedules, and No-Shows"
        desc="3.1 User Cancellations &amp; Reschedules:"
      />
      <ContentCompWithSubs
        extra1=""
        title=""
        desc1=" If a User reschedules a consultation within 48 hours, the original consultation time will
be considered canceled, and the 50% fee will apply to the Consultant."
        desc2=" Users can cancel or reschedule a consultation without penalty up to 48 hours before the
scheduled consultation time."
        extra2=""
        desc3=" Cancellations made within 48 hours of the scheduled consultation will incur a 50% fee of
the consultation fee, which will be paid directly to the Consultant."
        extra3=""
      />
      <ContentCompWithSubs
        extra1=""
        title="3.2 Consultant Cancellations &amp; No-Shows:"
        desc1=" If a Consultant does not show up for the scheduled consultation, the User will receive a
full refund of the consultation fee. The Consultant will not be compensated for the
missed session."
        desc2=" The Consultant’s ranking within the platform will be affected by no-shows and
cancellations, which may impact their future bookings."
        extra2=""
        desc3=" Multiple No-Shows: If a Consultant accumulates multiple no-shows, their profile may be
temporarily or permanently removed from the Service, subject to the discretion of
Mangerine."
        extra3=""
      />
      <ContentComp
        extra="Neither the User nor the Consultant will be liable for failure to attend the
consultation due to circumstances beyond their control (e.g., natural disasters, technical
failures of a major scale such as power outages during a disaster, or other emergencies). In such
cases, the consultation may be rescheduled without penalty."
        title=""
        desc="3.3 Force Majeure:"
      />
      <ContentCompWithSubs
        extra1=""
        title="4. Video Participation"
        desc1="4.1 Consultation Format:"
        desc2="4.2 Video Etiquette:"
        extra2="Users and Consultants are expected to conduct themselves professionally
during video consultations. The Service reserves the right to remove any User or Consultant
from the consultation if they engage in inappropriate behavior, harassment, or violate the
community guidelines."
        desc3=""
        extra3=""
      />
      <ContentCompWithSubs
        extra1=""
        title="4.3 Recording Consent:"
        desc1=" User and Consultant Consent: Both parties must provide explicit consent for video
recording at the start of each consultation. A notification will be displayed on screen
informing both parties that the session is being recorded."
        desc2=" Recording Access: Recordings will be accessible only to the User and Consultant who
participated in the session unless required for legal or compliance reasons. Recordings
will be stored securely and will be automatically deleted after 30 days, unless the User
or Consultant chooses to keep them for future reference."
        extra2=""
        desc3=" Legal Compliance: Recordings will be stored and handled in compliance with applicable
data protection laws, including GDPR (EU), HIPAA (U.S.), and any other regional privacy
regulations."
        extra3=""
      />
      <ContentCompWithSubs
        extra1=""
        title="4.4 Video Recording Guidelines:"
        desc1=" Prohibited Recording: Recording the session without the other party’s consent is strictly
prohibited. Any violation of this rule may result in immediate termination of the
consultation and removal from the platform."
        desc2=" Consultant Responsibilities: Consultants must ensure that the content of the
consultation is not recorded or shared outside of the Service unless explicitly authorized
by the User."
        extra2=""
        desc3=" Data Storage and Protection: All video recordings will be encrypted and stored in
compliance with global data protection standards. By agreeing to these terms, both
Users and Consultants consent to the storage of such data."
        extra3=""
      />
      <ContentComp
        extra="Payments for consultations are processed through designated third
party providers. Users agree to provide accurate payment information and authorize
Mangerine to charge the designated payment method for consultation fees."
        title="5. Payments and Fees"
        desc="5.1 Payment Processing:"
      />
      <ContentCompWithSubs
        extra1=""
        title="6. User and Consultant Responsibilities"
        desc1="6.1 User Responsibilities:"
        desc2=" Users agree to arrive on time for consultations and to respect the Consultant’s time."
        extra2=""
        desc3=" Users must provide accurate information when booking consultations."
        extra3=""
        desc4=" Users must conduct themselves in a respectful and professional manner during the
consultation."
      />
      <ContentCompWithSubs
        extra1=""
        title="6.2 Consultant Responsibilities:"
        desc1=" Consultants are required to provide professional services based on their expertise and in
accordance with the standards of their field."
        desc2=" Consultants must ensure their availability and be punctual for all scheduled
consultations."
        extra2=""
        desc3=" Consultants must maintain a professional demeanor during consultations and provide
clear and accurate information to Users."
        extra3=""
        desc4=" Consultants must comply with all applicable laws and regulations in the provision of
their services (e.g., medical licensing, legal qualifications, etc.)."
      />
      <ContentCompWithSubs
        extra1=""
        title="7. Restrictions on Sharing and Recording"
        desc1="7.1 No Public Sharing or Distribution:"
        desc2=" User Restrictions: Users are strictly prohibited from sharing, distributing, or publishing
any part of their video consultation, including the content of the discussion, on public
platforms, social media, or any other medium. The consultation content is strictly for
personal use and should not be used for commercial, promotional, or any other purpose
that could lead to public exposure, except where required by law."
        extra2=""
        desc3=" Consultant Restrictions: Consultants must also refrain from using any content from the
consultation as part of case studies, public examples, or promotional materials, in any
form that would identify or suggest the individual involved in the consultation. Personal
discussions, especially those involving sensitive matters, must not be shared in a way
that suggests the identity of the User or reveals confidential information."
        extra3=""
      />
      <ContentCompWithSubs
        extra1=""
        title="7.2 Recording Availability and Download:"
        desc1=" User Consent for Recording Download: After the consultation, Users may elect to
download a copy of the video recording for a fee. However, recordings will only be
available for download 30 days after the consultation to allow for storage compliance.
Users must pay the designated fee before downloading the recording."
        desc2=" Recording Storage and Access: Recordings will be securely stored on the platform and
will be made available to the User for download only within the 30-day period. The User
acknowledges that the ability to download the recording is contingent on payment of the
applicable download fee."
        extra2=""
      />
      <ContentCompWithSubs
        extra1="Both Users and Consultants are prohibited from using
external recording devices (e.g., smartphones, cameras, screen recording software, or
any other device not provided by the platform) during the video consultation. This
includes recording the session in any way that allows it to be shared or distributed
externally, outside of the platform’s secure environment."
        title="7.3 Prohibited External Recording Devices:"
        desc1=" No External Recording Devices: After the consultation, Users may elect to
download a copy of the video recording for a fee. However, recordings will only be
available for download 30 days after the consultation to allow for storage compliance.
Users must pay the designated fee before downloading the recording."
        desc2=" Platform-Only Recording:"
        extra2="The only permissible recording during the consultation is the
one initiated by the platform itself. Both parties will be notified when a session is being
recorded by the platform, and such recordings will be stored according to the platform&#39;s
privacy and security protocols."
      />
      <ContentCompWithSubs
        extra1="The recordings of consultations will not be shared with
any third party, except where required by law, or where the User and Consultant have
given express written consent. Any access to the recording by third parties will be
strictly controlled and in compliance with applicable data protection laws."
        title="7.4 Third-Party Access to Recordings:"
        desc1=" Limited Access to Recordings: "
        extra2="In cases where the platform is required to provide the recording due to
legal demands (e.g., subpoenas, court orders, or other legal obligations), Mangerine will
provide the recording in accordance with applicable laws, but only to the extent
required by the legal authority making the request. In such cases, the User and
Consultant will be notified, unless prohibited by law."
        desc2=" Legal Demands:"
      />
      <ContentComp
        extra="Any violation of these restrictions (e.g., sharing recordings
without consent, using external recording devices, or violating confidentiality agreements) may
result in immediate suspension or termination of the User or Consultant&#39;s account, as well as
legal action if warranted. The platform reserves the right to take necessary actions to protect
the privacy of both Users and Consultants."
        desc="7.5 Consequences for Violation:"
        title=""
      />
      <ContentCompWithSubs
        extra1=""
        desc1="8.1 Confidentiality of Consultations: "
        extra2="All consultations are strictly confidential. The User’s personal
information, case details, and any discussion shared during the consultation are to be
kept private and should not be disclosed to anyone outside the consultation, unless
required by law."
        desc2="User Confidentiality:"
        desc3=" Consultant Confidentiality:"
        extra3="Consultants are bound by professional confidentiality
agreements (where applicable) and must uphold the privacy of all information shared by
the User during the consultation. Consultants are prohibited from disclosing, using, or
sharing any personal data or details discussed with the User in any context other than
the consultation, without the User’s express consent."
      />
      <ContentComp
        extra="The platform’s [Privacy Policy] governs how we collect, use, and protect
personal information. All Users and Consultants are encouraged to read the Privacy Policy to
understand how their personal data is handled."
        desc="8.2 Privacy Policy:"
        title=""
      />
      <ContentComp
        extra="Any data shared within the platform will not be disclosed to third parties
except where required by law or with the explicit consent of the User or Consultant."
        desc="8.3 Data Sharing:"
        title=""
      />
      <ContentComp
        extra="Both Users and Consultants are responsible for ensuring they have access to adequate technical
resources (e.g., internet connection, webcam, microphone) for the consultation. However, the
platform recognizes that occasional technical issues can occur, and the following guidelines will
apply:"
        desc="9.1 Technical Failures:"
        title="9. Technical Failures and Connectivity Issues"
      />
      <ContentCompWithSubs
        extra1="If the Service experiences a technical failure that prevents the
consultation from taking place (e.g., server crashes, connectivity issues on the
platform’s side), the User will be entitled to reschedule the consultation at no extra
charge. If the issue is not resolved in a reasonable timeframe, the User may request a
full refund."
        desc1=" Platform-Side Failures: "
        extra2="If the User or Consultant experiences a technical failure
that prevents the consultation from occurring (e.g., lost internet connection, device
malfunction), the following will apply:"
        desc2=" User/Consultant-Side Failures:"
        desc3=" Consultant Confidentiality:"
        extra3="o If the User is unable to attend or participate in the consultation due to such
issues, they may reschedule the consultation, but may be subject to a
rescheduling fee if the issue arises within 48 hours of the scheduled consultation."
        extra4="o If the Consultant is unable to attend due to technical difficulties, they will be
expected to reschedule the consultation at no extra charge or may provide the
User with a full refund."
      />
      <ContentComp
        desc=" Force Majeure:"
        extra="If either party is affected by a force majeure event (e.g., natural
disasters, power outages), the consultation can be rescheduled without penalties.
However, no refunds will be issued unless otherwise specified.
"
        title=""
      />
      <ContentCompWithSubs
        extra1="The platform is not intended to provide emergency services. Users are advised to seek
immediate assistance from the appropriate professionals (e.g., hospitals, legal authorities,
emergency hotlines) in case of an emergency. The platform and its Consultants are not
equipped to handle urgent, time-sensitive situations that require immediate attention.\7'"
        desc1="10.1 Non-Emergency Nature of the Service:"
        extra2="In the event that a User presents an emergency situation during a consultation, the Consultant
is expected to provide general advice, but it is emphasized that immediate professional help
should be sought elsewhere. The platform will not be held liable for any consequences of acting
on advice or recommendations given during a non-emergency consultation."
        desc2="10.2 Emergency Scenarios:"
        title="10. Emergency Situations"
      />
      <ContentComp
        desc=""
        extra="In the event that a User presents an emergency situation during a consultation, the Consultant
is expected to provide general advice, but it is emphasized that immediate professional help
should be sought elsewhere. The platform will not be held liable for any consequences of acting
on advice or recommendations given during a non-emergency consultation..
"
        title="10.2 Emergency Scenarios:"
      />
      <ContentCompWithSubs
        extra1="Users must understand that Consultants may be subject to licensing or regulatory
requirements based on their location or professional field. For example:"
        desc1="11.1 Jurisdictional Compliance:"
        extra2="Consultants offering legal advice may only be licensed to practice in
certain jurisdictions. Users are encouraged to confirm the Consultant&#39;s qualification and
jurisdiction before booking a session."
        desc2=" Legal Consultants: Consultants"
        desc3="Medical Consultants:"
        extra3="Medical professionals may be subject to healthcare regulations
such as HIPAA (in the U.S.) or local laws in other jurisdictions. Users should verify the
Consultant’s professional certification and jurisdiction before consulting."
        title="11. Consultant Jurisdictions and Licensing Requirements"
      />
      <ContentComp
        desc=""
        extra="The platform makes no representation or warranty regarding the specific licensing or
professional certification of any Consultant, and Users should perform their due diligence to
ensure they are receiving advice from an appropriately qualified professional..
"
        title="11.2 Platform Disclaimer:"
      />
      <ContentCompWithSubs
        extra1="Consultations in fields such as medicine, law, and finance may involve the exchange of sensitive
information, including personal health data, financial details, or legal matters. The platform has
implemented the following measures to protect such data:"
        desc1="12.1 Handling of Sensitive Data:"
        extra2="All consultations are conducted on a secure platform with end-to-end
encryption to ensure the privacy and security of all communications."
        desc2=" Data Encryption: All"
        desc3="Privacy Policy:"
        extra3="Both Users and Consultants agree to the platform&#39;s Privacy Policy, which
governs the handling of sensitive data, in accordance with applicable privacy laws (e.g.,
GDPR, HIPAA)."
        title="12. Sensitive Data and Privacy Standards"
        desc4="Data Storage and Retention:"
        extra4="Sensitive data shared during consultations will be retained
for a maximum period of 30 days (unless required for legal purposes), after which it will
be securely deleted."
      />
      <ContentComp
        desc=""
        extra="By proceeding with a consultation, Users consent to the collection, storage, and use of their
sensitive data by the platform, as described in the Privacy Policy.
"
        title="12.2 User Consent:"
      />
      <ContentCompWithSubs
        extra1="The platform maintains a zero-tolerance policy toward abusive, discriminatory, or inappropriate
behavior. Users and Consultants must adhere to respectful and professional conduct during
consultations. The following are considered violations of platform standards:"
        desc1="13.1 Prohibited Conduct:"
        extra2="Any form of verbal, emotional, or sexual harassment towards the other
party."
        desc2=" Harassment:"
        desc3=" Discrimination: "
        extra3="Any behavior based on race, gender, sexual orientation, religion, or
other protected characteristics."
        title="13. Abusive Behavior and Conduct"
        desc4=" Inappropriate Content:"
        extra4="Sharing explicit, offensive, or unlawful content during the
consultation."
      />
      <ContentCompWithSubs
        desc1="Any individual found engaging in abusive behavior may face immediate penalties, including:"
        desc2=" Temporary or Permanent Suspension of their account."
        desc3=" Banning from Future Consultations with the offending Consultant. "
        title="13.2 Penalties for Violations:"
        desc4=" Legal Action may be taken if the behavior involves threats, harassment, or other legal
violations."
      />
      <ContentComp
        desc=""
        extra="Users and Consultants may report any inappropriate behavior via the platform’s reporting
system. The platform will investigate complaints promptly and take appropriate action in
accordance with its policies.
"
        title="14. Account Suspension and Termination"
      />
      <ContentCompWithSubs
        desc1="14.1 Grounds for Suspension or Termination:"
        extra1="The platform reserves the right to suspend or terminate the account of any User or Consultant
under the following circumstances:"
        desc2=" Failure to Adhere to Terms:"
        extra2="Repeated violations of the platform’s Terms and
Conditions, including late arrivals, cancellations, and failure to maintain professional
behavior."
        desc3=" Abusive or Illegal Conduct:"
        extra3="Engaging in abusive behavior or illegal activities, including
fraud, harassment, or illegal practices."
        title="13.2 Penalties for Violations:"
        desc4=" Failure to Fufill Obligations:"
        extra4="If a Consultant fails to fulfill their paid service obligations."
      />
      <ContentCompWithSubs
        desc1=" Violation of Confidentiality:"
        extra1="Unauthorized sharing or distribution of consultation
recordings or confidential information."
        desc2=" Consultant Non-Compliance:"
        extra2="If a Consultant fails to comply with jurisdictional licensing
or regulatory requirements."
      />

      <ContentComp
        desc=""
        extra="Users or Consultants whose accounts are suspended or terminated have the right to appeal the
decision by contacting the platform’s support team. Appeals will be reviewed on a case-by-case
basis, and a final decision will be communicated within 5 business days.
"
        title="14.2 Appeal Process:"
      />
      <ContentCompWithSubs
        title="15. General Agreement"
        desc1="15.1 Acknowledgment of Terms:"
        extra1="By using the platform, you acknowledge that you have read, understood, and agree to be
bound by these Terms and Conditions. This Agreement constitutes the entire understanding
between you and the platform with regard to the Service."
      />
      <ContentCompWithSubs
        title="15.2 Ongoing Agreement:"
        extra1="These Terms and Conditions remain in full effect for as long as you use the platform. Any
modifications to these Terms will be communicated to Users and Consultants, and the updated
version will be required for continued use of the Service."
      />
      <ContentComp
        desc=""
        extra="Both Users and Consultants must comply with applicable laws, including data protection laws,
licensing requirements, and professional ethical standards.
"
        title="15.3 Legal Compliance:"
      />
      <ContentCompWithSubs
        title="16. Legal Compliance and International Applicability"
        desc1="16.1 Global Compliance:"
        extra1="As this Service operates globally, Users and Consultants agree to
comply with all applicable laws and regulations, including but not limited to those governing
privacy, data protection, and confidentiality, in their respective jurisdictions. This includes
compliance with laws such as:"
        extra3=" General Data Protection Regulation (GDPR) for users in the European Union."
        extra2=" Personal Data Protection Act (PDPA) for users in Southeast Asia."
        extra4=" Health Insurance Portability and Accountability Act (HIPAA) for users in the United"
      />
      <ContentComp
        desc=""
        extra=" Other local data protection laws applicable in the User’s or Consultant’s jurisdiction."
        title=""
      />
      <ContentComp
        desc=""
        extra="The Compliance to specific industry standards
supersedes the guidelines outlined in this document. All Consultants are expected to abide with
the standards demanded by their professional practice regardless of using the Mangerine
platform as a medium. Mangerine will not be responsible for such compliance lapses. Each
Consultant acknowledges to bearing full responsibility for all engagements on the platform.
Consultant’s accountability will continue in full force and effect and in perpetuity."
        title="16.2 Compliance to Industry Standards:"
      />
      <ContentComp
        desc="17.1 Acknowledgment:"
        extra="By using the platform, Users and Consultants acknowledge and agree to
these Terms and Conditions, including the restrictions on sharing and recording. Both parties
understand that violations of these provisions may result in account suspension, legal
consequences, or other corrective actions as deemed necessary by Mangerine."
        title="17. Final Agreement"
      />
      <ContentComp
        title=""
        extra="Mangerine reserves the right to update or modify these Terms and
Conditions at any time. Any material changes will be communicated to Users and Consultants
through appropriate means, and users will be required to accept the updated terms before
continuing to use the Service."
        desc="17.2 Updates to Terms:"
      />
      <ContentComp
        title="18. Disputes Resolution and Governing Law"
        extra="Mangerine is a platform that connects users (e.g., clients and consultants) but is not a party to
any contract, agreement, or transaction between them. Mangerine is not responsible for the
performance, quality, legality, accuracy, or any outcome of services exchanged between users."
        desc="18.1 User Responsibility"
      />
      <ContentComp
        title="18.2 Resolution of Disputes Between Users"
        extra="If a dispute arises between users, both parties agree to first attempt to resolve the matter
directly and amicably. If unresolved, users may contact Mangerine Support for voluntary, non-
binding mediation. Mangerine may assist at its sole discretion but is not obligated to do so. Any
outcome is non-binding unless both parties agree otherwise."
        desc=""
      />
      <ContentComp
        title="18.3 Users Within the United States"
        extra="If both users are located in the United States, they agree to resolve any dispute under the laws
of the State of Delaware, through binding arbitration, as detailed in Section 16.2."
        desc=""
      />
      <ContentComp
        title="18.4 Users Outside the United States"
        extra="If one or both users are located outside the United States, the dispute will be resolved by
binding arbitration in accordance with the International Chamber of Commerce (ICC)
Arbitration Rules, with the seat of arbitration in Delaware, United States, and the language of
arbitration as English, unless both parties agree otherwise."
        desc=""
      />
      <ContentComp
        title="19. Governing Law and Disputes with Mangerine"
        extra="These Terms and any use of the Mangerine platform are governed by and construed in
accordance with the laws of the State of Delaware, United States, without regard to its conflict
of law principles."
        desc="19.1 Governing Law"
      />
         <ContentCompWithSubs
        title="19.2 Disputes with Mangerine"
        extra1="Any dispute or claim between you and Mangerine will be resolved by final and binding
arbitration in accordance with the ICC Arbitration Rules, with the seat of arbitration in
Delaware, United States, and the arbitration conducted in English. The arbitrator’s decision will
be final and enforceable in any competent court."
        desc2="No Class Actions:"
        extra2="You and Mangerine waive any right to a jury trial or to participate in a class
action, to the extent permitted by law."
      />

          <ContentComp
        title="20. Consumer Protection and Local Law Compliance"
        extra="Nothing in these Terms limits or excludes any rights you may have under applicable consumer
protection laws in your country or state of residence. Where such laws apply, they may
override parts of these Terms."
        desc="20.1 Local Consumer Rights"
      />
          <ContentComp
        title="20.2 EU and UK Users"
        extra="If you are a consumer residing in the European Union or the United Kingdom, you may have the
right to bring claims in the courts of your home country. Nothing in these Terms overrides any
mandatory consumer protection rights under your local law.
For business users, including service providers and consultants using Mangerine for commercial
purposes, these Terms — including the arbitration and governing law provisions — apply in full."
        desc=""
      />
      <Box>
             <ContentCompWithSubs
        title="Mangerine LLC"
   
        desc1="support@mangerine.com"
        desc2="www.mangerine.com"
      />
      </Box>
    </Box>
  );
};
