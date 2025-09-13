import { useSkipLinks } from '../../hooks/useAccessibility';

const SkipLinks = () => {
  const { skipLinks, handleSkipLinkClick } = useSkipLinks();

  // Default skip links for the app
  const defaultSkipLinks = [
    { id: 'main-content', label: 'Skip to main content', targetId: 'main-content' },
    { id: 'navigation', label: 'Skip to navigation', targetId: 'navigation' },
    { id: 'footer', label: 'Skip to footer', targetId: 'footer' },
  ];

  const allSkipLinks = [...defaultSkipLinks, ...skipLinks];

  return (
    <nav aria-label="Skip links" className="sr-only">
      {allSkipLinks.map((link) => (
        <a
          key={link.id}
          href={`#${link.targetId}`}
          className="skip-link"
          onClick={(e) => {
            e.preventDefault();
            handleSkipLinkClick(link.targetId);
          }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
};

export default SkipLinks;
