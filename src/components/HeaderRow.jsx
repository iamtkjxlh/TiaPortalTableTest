function HeaderRow({ title = "名称" }) {
  return (
    <div className="header-row">
      <span className="header-title">{title}</span>
    </div>
  )
}

export default HeaderRow
