export const PLATFORMS = {
  GITHUB: {
    name: "GitHub",
    logo: "/logos/github.svg",
    providers: {
    //   USERNAME: {
    //     id: 'github-username',
    //     label: 'GitHub Username',
    //     providerId: '6d3f6753-7ee6-49ee-a545-62f1b1822ae6'
    //   },
      REPOS: {
        id: 'github-repos',
        label: 'Total Repositories',
        providerId: '5622b4ea-b953-4cd9-a377-409bb7ed5ec5'
      },
      CONTRIBUTIONS: {
        id: 'github-contributions',
        label: 'Total Contributions',
        providerId: '8573efb4-4529-47d3-80da-eaa7384dac19'
      }
    }
  },
  LEETCODE: {
    name: "LeetCode",
    logo: "/logos/leetcode.png",
    providers: {
    //   USERNAME: {
    //     id: 'leetcode-username',
    //     label: 'LeetCode Username',
    //     providerId: 'ee7d77c4-61da-4b87-b9d3-7ebb7560d264'
    //   },
      SOLVED: {
        id: 'leetcode-solved',
        label: 'Total Questions Solved',
        providerId: '29162ff4-c52c-4275-829e-f8eaba1e7b99'
      }
    }
  },
  CODEFORCES: {
    name: "Codeforces",
    logo: "/logos/codeforces.png",
    providers: {
    //   USERNAME: {
    //     id: 'codeforces-username',
    //     label: 'Codeforces Username',
    //     providerId: 'dbdcd386-829b-4ef9-a85d-4679367ddf89'
    //   },
      RATING: {
        id: 'codeforces-rating',
        label: 'Rating',
        providerId: 'a3d3ccd1-25dd-4307-9265-04d0a6d8b00c'
      }
    }
  },
//   CODECHEF: {
//     name: "CodeChef",
//     logo: "/logos/codechef.svg",
//     providers: {
//       USERNAME: {
//         id: 'codeforces-username',
//         label: 'Rating',
//         providerId: '97e682b9-f89d-4517-b7de-0935242a3c83'
//       }
//     }
//   }
};
