const good = {
  id: 10,
  nameuk: 'sdff',
  nameru: 'fdsf',
  descriptionuk: '<p>sdfsdf\t</p>',
  descriptionru: '<p>sdfsdf</p>',
  art: '432423',
  characteristicuk:
    '<ul><li><p>dsf</p><span>fsdf</span></li><li><p>sdf</p><span>fsdf</span></li></ul>',
  characteristicru:
    '<ul><li><p>dsfsdf</p><span>fsdf</span></li><li><p>sdf</p><span>fsd</span></li></ul>',
  video: null,
  createdAt: '2025-05-26T11:55:35.000Z',
  updatedAt: '2025-05-26T11:55:35.000Z',
  brendId: 1,
  categoryId: 1,
  countryMadeId: 1,
  subcategoryId: 1,
  volumes: [
    {
      id: 5,
      nameVolume: 'ry',
      volume: '500',
      price: 342,
      discount: 10,
      priceWithDiscount: 243,
      metaTitleuk: 'dsf',
      metaDescriptionuk: 'fdsf',
      canonicaluk: 'fdsf',
      metaTitleru: 'fsdf',
      metaDescriptionru: 'fdsf',
      canonicalru: 'sdf',
      createdAt: '2025-05-26T11:55:35.000Z',
      updatedAt: '2025-05-26T11:55:35.000Z',
      goodId: 10,
      imgs: [
        {
          id: 9,
          img: 'image1.png',
          volumeuk: 'sdf',
          volumeru: 'fdsf',
          createdAt: '2025-05-26T11:55:35.000Z',
          updatedAt: '2025-05-26T11:55:35.000Z',
          volumeId: 5
        },
        {
          id: 10,
          img: 'image3.png',
          volumeuk: 'fdsf',
          volumeru: 'fdsf',
          createdAt: '2025-05-26T11:55:35.000Z',
          updatedAt: '2025-05-26T11:55:35.000Z',
          volumeId: 5
        }
      ]
    },
    {
      id: 6,
      nameVolume: 'мл',
      volume: '400',
      price: 500,
      discount: 10,
      priceWithDiscount: 450,
      metaTitleuk: 'fsdf',
      metaDescriptionuk: 'fdsf',
      canonicaluk: 'fsdf',
      metaTitleru: 'fsd',
      metaDescriptionru: 'fsdf',
      canonicalru: 'fsdf',
      createdAt: '2025-05-26T11:55:35.000Z',
      updatedAt: '2025-05-26T11:55:35.000Z',
      goodId: 10,
      imgs: [
        {
          id: 11,
          img: 'image3.png',
          volumeuk: 'dfs',
          volumeru: 'fds',
          createdAt: '2025-05-26T11:55:35.000Z',
          updatedAt: '2025-05-26T11:55:35.000Z',
          volumeId: 6
        },
        {
          id: 12,
          img: 'image1.png',
          volumeuk: 'fdsf',
          volumeru: 'fsdf',
          createdAt: '2025-05-26T11:55:35.000Z',
          updatedAt: '2025-05-26T11:55:35.000Z',
          volumeId: 6
        }
      ]
    }
  ],
  brend: {
    id: 1,
    name: 'BAf',
    createdAt: '2025-05-26T10:33:35.000Z',
    updatedAt: '2025-05-26T10:33:35.000Z'
  },
  countryMade: {
    id: 1,
    nameuk: 'Китаї',
    nameru: 'Китаї',
    createdAt: '2025-05-26T10:33:58.000Z',
    updatedAt: '2025-05-26T10:33:58.000Z'
  },
  subcategory: {
    id: 1,
    nameuk: 'Два в одному',
    nameru: 'Два в одномуru',
    createdAt: '2025-05-26T10:36:16.000Z',
    updatedAt: '2025-05-26T10:36:16.000Z',
    categoryId: 1
  }
}

export const data = new Array(40).fill(good)
