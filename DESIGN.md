# Design Brief: Adarsh Siksha Kendre Admission Management

## Tone & Purpose
Professional institutional dashboard for school admissions and fee management. Deep trust through navy blue, energized by warm orange accents. Approachable yet authoritative.

## Color Palette

| Token | OKLCH | Usage |
| --- | --- | --- |
| Primary | `0.32 0.12 245` | Deep navy — header, navigation, primary actions |
| Accent | `0.62 0.19 36` | Warm orange-gold — CTAs, fee indicators, attention |
| Secondary | `0.52 0.11 257` | Muted indigo — secondary hierarchy |
| Destructive | `0.54 0.22 22` | Red-brown — delete actions, warnings |
| Muted | `0.92 0.01 0` | Soft grey — backgrounds, disabled states |
| Background | `0.975 0.001 0` | Off-white — main canvas |

## Typography
- Display: Fraunces (serif) — school name, section headers, institutional warmth
- Body: GeneralSans (sans) — readable, professional, all content
- Mono: JetBrainsMono — technical fields, IDs, amounts

## Elevation & Depth
- Cards: 1px border on `border` token, subtle shadow on hover
- Header: Primary background with 2px bottom border, distinct from content
- Sections: Alternating `bg-background` and `bg-muted/10` for rhythm
- Floating actions: Subtle shadow, larger on hover/active

## Structural Zones
| Zone | Background | Border | Height |
| --- | --- | --- | --- |
| Header | Primary | 2px bottom | 80px |
| Content | Background | None | Flex |
| Card | Card | 1px | Auto |
| Footer | Muted/10 | 1px top | 40px |

## Component Patterns
- Buttons: Filled primary for main, outlined secondary for alt, accent for payments
- Forms: Input fields with soft border, focus ring primary
- Fee status: Green pill for Paid, orange for Pending, red for Overdue
- Tables: Alternating row colors via striped, hover lift

## Motion
- Transitions: `transition-smooth` (0.3s cubic) for all interactive elements
- Hover: Slight elevation lift on cards, color shift on buttons

## Spacing & Rhythm
Base: 4px. Padding: 16px cards, 24px sections, 32px page. Gap: 12px within groups, 24px between sections.

## Constraints
- No gradients, no decorative elements beyond borders
- Max 3 colors per screen
- Navy-forward branding throughout
- Accessibility: AA+ contrast maintained in light and dark modes
