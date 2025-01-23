describe('Proxy', () => {
  it('should handle empty file content', () => {
    const reader = { onload: null, result: '' }
    const handleFileRead = jest.fn()
    reader.onload = handleFileRead

    handleFileRead({ target: reader })
    expect(handleFileRead).toHaveBeenCalledWith({ target: { result: '' } })
  })

  it('should parse proxies from file content', () => {
    const reader = { onload: null, result: 'proxy1:user1:pass1\nproxy2:user2:pass2' }
    const handleFileRead = jest.fn()
    reader.onload = handleFileRead

    handleFileRead({ target: reader })
    expect(handleFileRead).toHaveBeenCalledWith({ target: { result: 'proxy1:user1:pass1\nproxy2:user2:pass2' } })
  })

  it('should handle malformed proxy lines', () => {
    const reader = { onload: null, result: 'proxy1:user1:pass1\ninvalid\nproxy2:user2:pass2' }
    const handleFileRead = jest.fn()
    reader.onload = handleFileRead

    handleFileRead({ target: reader })
    expect(handleFileRead).toHaveBeenCalledWith({ target: { result: 'proxy1:user1:pass1\ninvalid\nproxy2:user2:pass2' } })
  })
}
