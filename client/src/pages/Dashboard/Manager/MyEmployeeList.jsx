import { Helmet } from 'react-helmet-async'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import useAuth from '../../../hooks/useAuth'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'

const MyEmployeeList = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()

  // Fetch My Employees Data
  const {
    data: myEmployees = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['myEmployees', user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/myEmployees/${user?.email}`)
      return data
    },
  })

  // Delete a My Employee
  const { mutateAsync } = useMutation({
    mutationFn: async id => {
      const { data } = await axiosSecure.delete(`/myEmployee/${id}`)
      return data
    },
    onSuccess: data => {
      console.log(data)
      refetch()
      toast.success('Employee removed from my employees successfully.')
    },
  })

  // Handle Delete
  const handleRemoveEmployee = async id => {
    console.log(id)
    try {
      await mutateAsync(id)
    } catch (err) {
      console.log(err)
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <>
      <Helmet>
        <title>My Employees</title>
      </Helmet>

      <div className='container mx-auto px-4 sm:px-8'>
        <div className='py-8'>
          <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
            <div className='inline-block min-w-full shadow rounded-lg overflow-hidden'>
              <table className='min-w-full leading-normal'>
                <thead>
                  <tr>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Image
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Name
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Member Type
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Remove From My Employees
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* employee rows */}
                  {myEmployees.map(employee => (
                    <tr key={employee.id}>
                      <td className='px-5 py-5 border-b border-gray-200'>
                        <div className='flex items-center'>
                          <div className='flex-shrink-0 w-10 h-10'>
                            <img className='w-full h-full rounded-full' src={employee.imageUrl} alt={employee.name} />
                          </div>
                        </div>
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200'>
                        <p className='text-gray-900 whitespace-no-wrap'>{employee.name}</p>
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200'>
                        <p className='text-gray-900 whitespace-no-wrap'>{employee.memberType}</p> {/* Optional */}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200'>
                        <button onClick={() => handleRemoveEmployee(employee.id)} className='text-indigo-600 hover:text-indigo-900'>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MyEmployeeList
