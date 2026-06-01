import {
  Box,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import CustomButton from "mangarine/components/customcomponents/button";
import { useRouter } from "next/router";
import { IoArrowBack } from "react-icons/io5";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <VStack alignItems="flex-start" spaceY={2} w="full">
    <Text fontSize="1rem" fontWeight="700" color="text_primary">
      {title}
    </Text>
    {children}
  </VStack>
);

const Body = ({ children }: { children: React.ReactNode }) => (
  <Text fontSize="0.875rem" color="text_primary" fontWeight="400" lineHeight="1.6">
    {children}
  </Text>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <HStack alignItems="flex-start" spaceX={2}>
    <Text fontSize="0.875rem" color="text_primary" mt="1px">•</Text>
    <Text fontSize="0.875rem" color="text_primary" fontWeight="400" lineHeight="1.6">
      {children}
    </Text>
  </HStack>
);

const Numbered = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <HStack alignItems="flex-start" spaceX={2}>
    <Text fontSize="0.875rem" color="text_primary" fontWeight="400" minW="16px">
      {n}.
    </Text>
    <Text fontSize="0.875rem" color="text_primary" fontWeight="400" lineHeight="1.6">
      {children}
    </Text>
  </HStack>
);

export default function ConsultantLearnMore() {
  const router = useRouter();

  return (
    <Box maxW="2xl" mx="auto" px={{ base: 5, md: 8 }} py={{ base: 6, md: 10 }}>
      {/* Back header */}
      <HStack
        spaceX={2}
        mb={6}
        cursor="pointer"
        onClick={() => router.back()}
        w="fit-content"
      >
        <IoArrowBack size={18} color="var(--chakra-colors-text_primary)" />
        <Text fontSize="1.125rem" fontWeight="700" color="text_primary">
          Become a Consultant
        </Text>
      </HStack>

      <VStack alignItems="flex-start" spaceY={6} w="full">
        {/* Intro */}
        <VStack alignItems="flex-start" spaceY={2} w="full">
          <Text fontSize="1rem" fontWeight="700" color="text_primary">
            Turn Your Experience into Opportunity
          </Text>
          <Body>
            Mangerine allows you to offer your knowledge, expertise, and professional insight to people who need
            it, while earning income and building your professional brand.
          </Body>
          <Body>
            As a Consultant, clients can book time with you, pay securely through the platform, and meet with you
            through Mangerine&apos;s built-in video system.
          </Body>
          <Body>You remain in full control of your availability, your rate, and your time.</Body>
        </VStack>

        {/* Who is a Consultant */}
        <Section title="Who is a Consultant?">
          <Body>
            A Consultant is a professional who makes their expertise available to others through scheduled video
            sessions. This may include:
          </Body>
          <VStack alignItems="flex-start" spaceY={1} w="full" pl={2}>
            {[
              "Career professionals",
              "Business leaders",
              "Industry experts",
              "Members of Academia",
              "Mentors and coaches",
              "Creatives and specialists",
              "Celebrities",
              "Experienced Professionals in any field",
            ].map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </VStack>
          <Body>If you have knowledge that can help others, you can be a Consultant.</Body>
        </Section>

        {/* Why Become a Consultant */}
        <Section title="Why Become a Consultant?">
          <VStack alignItems="flex-start" spaceY={3} w="full">
            {[
              {
                label: "Earn from your knowledge",
                desc: "Set your hourly rate and get paid for every completed session.",
              },
              {
                label: "Build your professional reputation",
                desc: "Showcase your experience, your voice, and your personality.",
              },
              {
                label: "Help others succeed",
                desc: "Your guidance can make a real difference.",
              },
              {
                label: "Stay in control",
                desc: "You choose your availability. Minimum booking is 1 hour.",
              },
              {
                label: "Meet seamlessly",
                desc: "All meetings happen inside Mangerine using the built-in video system.",
              },
            ].map((item) => (
              <VStack key={item.label} alignItems="flex-start" spaceY={0} w="full">
                <Text fontSize="0.875rem" fontWeight="600" color="text_primary">
                  {item.label}
                </Text>
                <Body>{item.desc}</Body>
              </VStack>
            ))}
          </VStack>
        </Section>

        {/* How It Works */}
        <Section title="How It Works">
          <VStack alignItems="flex-start" spaceY={1} w="full" pl={1}>
            {[
              "You complete your consultant profile",
              "You set your hourly rate",
              "You add your payment details",
              "You set your available time on your calendar",
              "Clients book and pay for available time slots",
              "The session is automatically confirmed",
              "You meet the client through Mangerine video at the scheduled time",
              "Your earnings are credited to your account",
            ].map((step, i) => (
              <Numbered key={i} n={i + 1}>{step}</Numbered>
            ))}
          </VStack>
        </Section>

        {/* What You Need to Do */}
        <Section title="What You Need to Do">
          <Body>To activate your consultant profile, complete the following:</Body>

          <VStack alignItems="flex-start" spaceY={4} w="full">
            <VStack alignItems="flex-start" spaceY={1} w="full">
              <Text fontSize="0.875rem" fontWeight="600" color="text_primary">
                1. Complete Your Profile
              </Text>
              <Body>Your profile builds trust.</Body>
              <Body>Add:</Body>
              <VStack alignItems="flex-start" spaceY={1} w="full" pl={2}>
                {[
                  "Profile photo",
                  "Professional headline",
                  "Experience and expertise",
                  "Your video introduction (strongly recommended)",
                ].map((item) => (
                  <Bullet key={item}>{item}</Bullet>
                ))}
              </VStack>
            </VStack>

            <VStack alignItems="flex-start" spaceY={1} w="full">
              <Text fontSize="0.875rem" fontWeight="600" color="text_primary">
                2. Add Your Payment Details
              </Text>
              <Body>This allows you to receive your earnings securely.</Body>
            </VStack>

            <VStack alignItems="flex-start" spaceY={1} w="full">
              <Text fontSize="0.875rem" fontWeight="600" color="text_primary">
                3. Set Your Consultant Availability
              </Text>
              <Body>Set your price per hour.</Body>
              <Body>Clients will see your rate before booking.</Body>
            </VStack>

            <VStack alignItems="flex-start" spaceY={1} w="full">
              <Text fontSize="0.875rem" fontWeight="600" color="text_primary">
                4. Set Your Calendar Availability
              </Text>
              <Body>Select when you are available.</Body>
              <Body>
                Your availability will automatically display in your local time zone and convert to your
                client&apos;s time zone.
              </Body>
              <Body>Only available times can be booked.</Body>
            </VStack>
          </VStack>
        </Section>

        {/* What Happens Next */}
        <Section title="What Happened Next">
          <Body>Once activated:</Body>
          <VStack alignItems="flex-start" spaceY={1} w="full" pl={2}>
            {[
              "Your profile becomes visible to clients",
              "Clients can book your available time",
              "Payment confirms the appointment",
              "You meet at the scheduled time",
            ].map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </VStack>
        </Section>

        {/* Time Zone */}
        <Section title="Your Time Zone Matters">
          <Body>Your calendar automatically adjusts for global clients.</Body>
          <Body>Please ensure your Time zone is correctly set in your profile.</Body>
        </Section>

        {/* Success */}
        <Section title="Your Success Matters">
          <Body>Consultants who succeed on Mangerine:</Body>
          <VStack alignItems="flex-start" spaceY={1} w="full" pl={2}>
            {[
              "Keep their calendar updated",
              "Attend meetings on time",
              "Deliver real value",
              "Maintain a strong profile",
            ].map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </VStack>
          <Body>Your reputation grows with every session.</Body>
        </Section>

        {/* CTA */}
        <Box w="full" pt={2}>
          <CustomButton
            customStyle={{ w: "full", h: "14" }}
            onClick={() => router.push("/my-business?startOnboarding=1")}
          >
            <Text color="button_text" fontWeight="600" fontSize="1rem">
              Become a Consultant
            </Text>
          </CustomButton>
        </Box>
      </VStack>
    </Box>
  );
}
