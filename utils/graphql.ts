import { gql } from '@apollo/client';

export const UPDATE_LISTING_MUTATION = gql`
  mutation ($id: Int!, $listingType: String!, $amount: Float!, $amountType: String!, $description: String!, $imageNames: [String!]) {
    updateListing(
      id: $id
      input: {
        listingType: $listingType
        amount: $amount
        amountCurrency: "AED"
        amountType: $amountType
        imageNames: $imageNames
        description: $description
      }
    ) {
      id
      propertyId
      listingType
      amount
      amountCurrency
      amountType
      imageNames
      description
    }
  }
`;

export const UPDATE_PROPERTY_MUTATION = gql`
  mutation (
    $id: Int!
    $unitNumber: String!
    $propertyType: String!
    $beds: Float!
    $baths: Float!
    $sqft: Float!
    $amenities: [String!]
    $attributes: [String!]
  ) {
    updateProperty(
      id: $id
      input: {
        unitNumber: $unitNumber
        propertyType: $propertyType
        beds: $beds
        baths: $baths
        sqft: $sqft
        amenities: $amenities
        attributes: $attributes
      }
    ) {
      id
    }
  }
`;

export const GET_LISTING_QUERY = gql`
  query ($id: Int!) {
    getListing(id: $id) {
      id
      property {
        id
        unitNumber
        propertyType
        beds
        baths
        sqft
        amenities
        attributes
        buildingId
        communityId
      }
      listingType
      amount
      amountCurrency
      amountType
      imageNames
      description
    }
  }
`;

export const GET_S3PRESIGNEDUrl_QUERY = gql`
  query ($name: String!) {
    getS3PresignedUrl(imageName: $name) {
      url
    }
  }
`;

export const GET_LISTINGS_QUERY = gql`
  {
    getListings (offset: 0 limit: 1000) {
        total
        data {
          id
          property {
            id
            propertyType
            beds
            baths
            unitNumber
            sqft
            building {
              id
              name
              locationCoordinate
            }
            community {
              id
              name
            }
          }
          listingType
          amount
          amountCurrency
          amountType
          imageNames
          description
          isActive
        }
    }
  }
`;

export const COMMUTIES_QUERY = gql`
  {
    getCommunities (offset: 0, limit: 1000) {
      total
      data {
        id
        name
        isActive
      }
    }
  }
`;

export const BUILDINGS_QUERY = gql`
  {
    getBuildings (offset: 0, limit: 1000) {
      total
      data {
        id
        name
        country
        city
        state
        district
        zip
        address
        buildingNumber
        locationCoordinate
        communityId
        isActive
      }
    }
  }
`;

export const COMUNITIES_QUERY = gql`
  {
    getCommunities (offset: 0, limit: 1000) {
      total
      data {
        id
        name
        createdBy {
          name
        }
        updatedBy {
          name
        }
        isActive
      }
    }
  }
`;

export const CREATE_COMMUNITY_MUTATION = gql`
  mutation ($name: String!) {
    createCommunity(input: { name: $name }) {
      id
    }
  }
`;

export const GET_COMMUNITY_QUERY = gql`
  query ($id: Int!) {
    getCommunity(id: $id) {
      id
      name
    }
  }
`;

export const UPDATE_COMMUNITY_MUTATION = gql`
  mutation (
    $id: Int!
    $name: String!
  ) {
    updateCommunity (
      id: $id
      input: {
        name: $name
      }
    ) {
      id
    }
  }
`;

export const CREATE_BUILDING_MUTATION = gql`
  mutation (
    $name: String!
    $country: String!
    $city: String!
    $state: String!
    $district: String!
    $zip: String!
    $address: String!
    $buildingNumber: String!
    $locationLat: Float!
    $locationLng: Float!
    $communityId: Int!
  ) {
    createBuilding(
      input: {
        name: $name
        country: $country
        city: $city
        state: $state
        district: $district
        zip: $zip
        address: $address
        buildingNumber: $buildingNumber
        locationCoordinate: { type: "Point", coordinates: [$locationLat, $locationLng] }
        communityId: $communityId
      }
    ) {
      id
    }
  }
`;

export const CREATE_PROPERTY_MUTATION = gql`
  mutation (
    $buildingId: Int!
    $communityId: Int!
    $unitNumber: String!
    $propertyType: String!
    $beds: Float!
    $baths: Float!
    $sqft: Float!
    $amenities: [String!]
    $attributes: [String!]
  ) {
    createProperty(
      input: {
        buildingId: $buildingId
        communityId: $communityId
        unitNumber: $unitNumber
        propertyType: $propertyType
        beds: $beds
        baths: $baths
        sqft: $sqft
        amenities: $amenities
        attributes: $attributes
      }
    ) {
      id
    }
  }
`;

export const CREATE_LISTING_MUTATION = gql`
  mutation (
    $propertyId: Int!
    $listingType: String!
    $amount: Float!
    $amountType: String!
    $amountCurrency: String!
    $description: String!
    $imageNames: [String!]
  ) {
    createListing(
      input: {
        propertyId: $propertyId
        listingType: $listingType
        amount: $amount
        amountCurrency: $amountCurrency
        amountType: $amountType
        imageNames: $imageNames
        description: $description
      }
    ) {
      id
    }
  }
`;

export const GET_USER_QUERY = gql`
  {
    me {
      firebaseUserId
      phone
      role
      name
      email
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation ($email: String!, $name: String!, $phone: String!, $role: String!) {
    register(input: { email: $email, name: $name, phone: $phone, role: $role }) {
      firebaseUserId
      email
      name
      phone
      role
    }
  }
`;

export const CREATE_LISTING_CONTACTUS_MUTATION = gql`
  mutation ($firstName: String!, $lastName: String!, $email: String!, $phone: String!, $note: String!) {
    createContactUs(
      input: {
        type: "listing_inquiry"
        firstName: $firstName
        lastName: $lastName
        email: $email
        phone: $phone
        note: $note
      }
    ) {
      id
    }
  }
`;

export const CREATE_VIEWING_CONTACTUS_MUTATION = gql`
  mutation (
    $firstName: String!
    $lastName: String!
    $email: String!
    $phone: String!
    $note: String!
    $viewingDate: String!
  ) {
    createContactUs(
      input: {
        type: "viewing_inquiry"
        firstName: $firstName
        lastName: $lastName
        email: $email
        phone: $phone
        note: $note
        metadata: { viewingDate: $viewingDate }
      }
    ) {
      id
    }
  }
`;

export const CREATE_OFFER_CONTACTUS_MUTATION = gql`
  mutation (
    $firstName: String!
    $lastName: String!
    $email: String!
    $phone: String!
    $note: String!
    $offerAmount: Int!
    $currency: String!
  ) {
    createContactUs(
      input: {
        type: "offer_inquiry"
        firstName: $firstName
        lastName: $lastName
        email: $email
        phone: $phone
        note: $note
        metadata: { offerAmount: $offerAmount, currency: $currency }
      }
    ) {
      id
    }
  }
`;

export const CREATE_CONTACTUS_AGENT_MUTATION = gql`
  mutation ($firstName: String!, $lastName: String!, $email: String!, $phone: String!, $note: String!, $city: String!) {
    createContactUs(
      input: {
        type: "agent_inquiry"
        firstName: $firstName
        lastName: $lastName
        email: $email
        phone: $phone
        note: $note
        metadata: { city: $city }
      }
    ) {
      id
    }
  }
`;

export const CREATE_CONTACTUS_GENERAL_MUTATION = gql`
  mutation ($firstName: String!, $lastName: String!, $email: String!, $phone: String!, $note: String!) {
    createContactUs(
      input: {
        type: "contact_inquiry"
        firstName: $firstName
        lastName: $lastName
        email: $email
        phone: $phone
        metadata: {
          message: $note
        }
      }
    ) {
      id
    }
  }
`;

export const GET_BUILDING_QUERY = gql`
  query ($id: Int!) {
    getBuilding(id: $id) {
      id
      name
      country
      city
      state
      district
      zip
      address
      buildingNumber
      locationCoordinate
      community {
        id
        name
      }
    }
  }
`;

export const UPDATE_BUILDING_MUTATION = gql`
  mutation (
    $id: Int!
    $name: String!
    $country: String!
    $state: String!
    $city: String!
    $district: String!
    $zip: String!
    $address: String!
    $buildingNumber: String!
    $locationCoordinate: JSON!
  ) {
    updateBuilding(
      id: $id
      input: {
        name: $name
        country: $country
        state: $state
        city: $city
        district: $district
        zip: $zip
        address: $address
        buildingNumber: $buildingNumber
        locationCoordinate: $locationCoordinate
      }
    ) {
      id
    }
  }
`;

export const CREATE_CONTACTUS_OWNER_MUTATION = gql`
  mutation ($firstName: String!, $lastName: String!, $email: String!, $phone: String!, $note: String!, $city: String!) {
    createContactUs(
      input: {
        type: "owner_inquiry"
        firstName: $firstName
        lastName: $lastName
        email: $email
        phone: $phone
        note: $note
        metadata: { city: $city }
      }
    ) {
      id
    }
  }
`;

export const GET_PRESIGNED_POST = gql`
  {
    getS3PresignedPost {
        url
        fields {
            bucket
            key
            policy
            algorithm
            credential
            date
            signature
        } 
    }
  }
`;

export const CREATE_USER_SUBSCRIPTION = gql`
  mutation ($listingId: Float!, $fromDate: String!, $toDate: String!) {
    createUserSubscription (
      input: {
        listingId: $listingId
        fromDate: $fromDate
        toDate: $toDate
      }
    ) {
      subscriptionId
      clientSecret
    }
  }
`;

export const CREATE_ONE_TIME_PAYMENT = gql`
  mutation (
    $listingId: Int!, 
    $duration: Int!
  ) {
    createOnetimePayment (
      input: {
        listingId: $listingId
        duration: $duration
      }
    ) {
      clientSecret
      ephemeralKey
      customer
      publishableKey
    }
  }
`;

export const CREATE_USER_CHECKOUT = gql`
  mutation (
    $listingId: Int!, 
  ) {
    createUserCheckout (
      input: {
        listingId: $listingId
      }
    ) {
      clientSecret
      ephemeralKey
      customer
      publishableKey
    }
  }
`;