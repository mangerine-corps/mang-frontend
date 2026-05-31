// Universal profile page at /profile/:uuid
// Works for both consultants and regular users; edit controls only shown to the owner.
// Next.js exposes the path segment as router.query.profileId — identical to the
// old query-param name — so all downstream queries (skills, education, etc.) work
// unchanged. The only difference from the legacy /profile?profileId=... route is that
// profileId is always defined here, so isOwnProfile is simply profileId === user.id.

export { default } from "../profile";
