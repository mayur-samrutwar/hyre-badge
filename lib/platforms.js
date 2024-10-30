export const PLATFORMS = {
  GITHUB: {
    name: "GitHub",
    logo: "/logos/github.svg",
    providers: {
      REPOS: {
        id: 'github-repos',
        label: 'Total Repositories',
        providerId: '5622b4ea-b953-4cd9-a377-409bb7ed5ec5',
        extractKey: 'repositories'
      },
      CONTRIBUTIONS: {
        id: 'github-contributions',
        label: 'Total Contributions',
        providerId: '8573efb4-4529-47d3-80da-eaa7384dac19',
        extractKey: 'contributions'
      }
    }
  },
  LEETCODE: {
    name: "LeetCode",
    logo: "/logos/leetcode.png",
    providers: {
      SOLVED: {
        id: 'leetcode-solved',
        label: 'Total Questions Solved',
        providerId: '29162ff4-c52c-4275-829e-f8eaba1e7b99',
        extractKey: 'solved'
      }
    }
  },
  CODEFORCES: {
    name: "Codeforces",
    logo: "/logos/codeforces.png",
    providers: {
      RATING: {
        id: 'codeforces-rating',
        label: 'Rating',
        providerId: 'a3d3ccd1-25dd-4307-9265-04d0a6d8b00c',
        extractKey: 'rating'
      }
    }
  }
};
