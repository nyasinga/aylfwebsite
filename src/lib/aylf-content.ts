/**
 * AYLF Website Content
 * All content matches https://aylfkenya.org/
 */

export const AYLF_CONTENT = {
  mission: {
    title: 'Mission',
    description:
      'Our aim is to be a movement of friends to nurture a new breed of leaders in Africa, based on the leadership qualities, values, and principles of Jesus of Nazareth as exemplified by some of history's greatest statesmen and women.',
  },
  coreValues: {
    title: 'Our Core Values',
    description:
      'Love – We maintain a Jesus-centered culture of unconditional love, among ourselves and our neighbors, appreciating our diversity (religious, political, racial, etc) and viewing all as equally created in the image of God.',
  },
  philosophy: {
    title: 'Our Philosophy',
    description:
      'Work is done simply in the name of Jesus under the auspices of a national leadership drawn from business, industry, politics, academia, and religion. It's not done under the name of any particular organization or religious group.',
  },
  hero: {
    title: 'Africa Youth Leadership Forum',
    subtitle:
      'A movement of friends nurturing a new breed of leaders in Africa, based on the leadership qualities, values, and principles of Jesus of Nazareth as exemplified by some of history's greatest statesmen and women.',
  },
  programs: [
    {
      title: 'The Ajibika Program',
      slug: 'ajibika',
      description:
        'A leadership program focused on developing transformative leaders in Africa.',
      category: 'Leadership Programs',
    },
    {
      title: 'Student Leadership Development Program',
      slug: 'sldp',
      description:
        'Our 8-month training program equips university students and soon-to-be graduates with leadership skills, community project experience, and thorough mentorship. Graduates become transformative agents, skilled in driving positive change across various sectors.',
      category: 'Leadership Programs',
    },
    {
      title: 'The University Student Leaders Gathering (Kenya & Uganda)',
      slug: 'uslg',
      description:
        'Now in its 14th year, this annual gathering brings together student leaders from across Africa to strengthen their leadership skills, broaden their networking possibilities, and foster meaningful friendships.',
      category: 'Leadership Programs',
    },
    {
      title: 'Ladies Gathering',
      slug: 'ladies-gathering',
      description:
        'Our program offers a dynamic blend of resources and support designed specifically for women, focusing on career advancement, leadership empowerment, and a supportive network, all aimed at enhancing their professional paths and personal growth.',
      category: 'Leadership Programs',
    },
    {
      title: 'University Outreach Program – Small Groups',
      slug: 'university-outreach',
      description:
        'With a presence in over 54 universities, we work with universities to provide students with ideal opportunities to develop key leadership skills, gain practical work experience, and engage in community development.',
    },
    {
      title: 'Fellows Program',
      slug: 'fellows',
      description:
        'The Fellows Program aims to develop value-driven leaders among alumni and beyond, equipping them to enact positive change across all sectors. The program focuses on comprehensive leadership development, networking opportunities, and active community engagement.',
    },
  ],
  contact: {
    phone: '+254 (0) 796 934 978',
    email: 'info@aylfkenya.org',
    hours: 'Mon/Fri 9:00AM to 5:00PM',
    address: 'Ufungamano House, Mamlaka Rd, Nairobi',
  },
  cta: {
    main: 'Creating transformation among young people to bring out a sustainable future for people in Africa.',
  },
} as const

export const AYLF_NAVIGATION = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'About AYLF', href: '/about' },
    {
      name: 'Our Programs',
      href: '/programs',
      submenu: [
        {
          category: 'Leadership Programs',
          items: [
            { name: 'The Ajibika Program', href: '/programs/ajibika' },
            { name: 'Student Leadership Development Program', href: '/programs/sldp' },
            {
              name: 'The University Student Leaders Gathering (Kenya & Uganda)',
              href: '/programs/uslg',
            },
            { name: 'Ladies Gathering', href: '/programs/ladies-gathering' },
          ],
        },
        { name: 'University Outreach Program – Small Groups', href: '/programs/university-outreach' },
        { name: 'Fellows Program', href: '/programs/fellows' },
      ],
    },
    { name: 'Shop', href: '/shop' },
    { name: 'Our Gallery', href: '/gallery' },
    { name: 'Our Events', href: '/events' },
    {
      name: 'Our Blog',
      href: '/news',
      submenu: [
        { name: 'Ajibika Think Tank', href: '/blog/ajibika-think-tank' },
        { name: 'Creative Hub', href: '/blog/creative-hub' },
      ],
    },
    { name: 'Contact Us', href: '/contact' },
  ],
} as const
